import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { StudentService } from 'src/modules/student/services/student.service';
import { MailerService } from '@nestjs-modules/mailer';
import { threadId } from 'worker_threads';
import { S3Service } from '../../../utils/bucket-s3';
import { UserFromJWT } from 'src/modules/auth/models/UserFromJWT';
import { UserPayload } from 'src/modules/auth/models/UserPayload';

enum TypeUserTransformToEnglish {
  'admin' = 'Administrador',
  'manager' = 'Gestor',
  'teacher' = 'Professor',
  'student' = 'Estudante',
  'sponsor' = 'Responsável',
}
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private studentService: StudentService,
    private mailerService: MailerService,
  ) {}

  async create(createUserDto) {
    const userExistsOnWaitlist = await this.prisma.waitList.findFirst({
      where: {
        value: createUserDto.email,
        approved: false,
      },
    });

    if (!userExistsOnWaitlist) {
      throw new HttpException(
        `Acesso negado. Informações inválidas`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashSalt = Number(process.env.HASH_SALT);
    const newData = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, hashSalt),
      birthDate: new Date(createUserDto.birthDate),
      type: userExistsOnWaitlist.role,
    };

    const createdUser = await this.prisma.user.create({
      data: {
        ...newData,
        address: {
          create: createUserDto.address,
        },
      },
      include: {
        address: true,
      },
    });

    const mail = {
      to: createdUser.email,
      from: 'noreply@application.com',
      subject: 'Cadastro realizado com sucesso',
      template: 'email-confirmation',
      context: {
        token: newData.confirmationToken,
      },
    };

    await this.mailerService.sendMail(mail);

    if (userExistsOnWaitlist.role === 'admin') {
      const createdAdmin = await this.prisma.admin.create({
        data: {
          status: true,
          userId: createdUser.id,
        },
      });

      const response = {
        ...createdUser,
        ...createdAdmin,
        password: undefined,
      };

      await this.prisma.waitList.update({
        data: {
          approved: true,
        },
        where: {
          id: userExistsOnWaitlist.id,
        },
      });

      return {
        data: response,
        status: HttpStatus.CREATED,
        message: 'Administrador cadastrado com sucesso.',
      };
    } else if (userExistsOnWaitlist.role === 'manager') {
      const createdManager = await this.prisma.manager.create({
        data: {
          status: true,
          // userId: createdUser.id,
          user: { connect: { id: createdUser.id } },
          schools: { connect: { id: userExistsOnWaitlist.schoolId } },
        },
        include: { schools: true },
      });

      const response = {
        ...createdUser,
        ...createdManager,
        password: undefined,
      };

      await this.prisma.waitList.update({
        data: {
          approved: true,
        },
        where: {
          id: userExistsOnWaitlist.id,
        },
      });

      return {
        data: response,
        status: HttpStatus.CREATED,
        message: 'Gestor cadastrado com sucesso.',
      };
    } else if (userExistsOnWaitlist.role === 'teacher') {
      const createdTeacher = await this.prisma.teacher.create({
        data: {
          status: true,
          user: { connect: { id: createdUser.id } },
          schools: { connect: { id: userExistsOnWaitlist.schoolId } },
        },
        include: { schools: true },
      });

      const response = {
        ...createdTeacher,
        password: undefined,
      };

      await this.prisma.waitList.update({
        data: {
          approved: true,
        },
        where: {
          id: userExistsOnWaitlist.id,
        },
      });

      return {
        data: response,
        status: HttpStatus.CREATED,
        message: 'Professor cadastrado com sucesso.',
      };
    } else {
      throw new HttpException(
        `Permissões insuficientes, não foi possível prosseguir com o cadastro desse tipo de usuário.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async changePassword(id: string, password: string) {
    const hashSalt = Number(process.env.HASH_SALT);

    const newPassword: string = await bcrypt.hash(password, hashSalt);

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: newPassword,
        recoverToken: null,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByIdForGetLoggedUser(id: string) {
    const loggedUser = await this.prisma
      .$queryRaw<UserPayload>`SELECT u.id, u."name", u."email", u."type"::text, u.avatar FROM public."User" u WHERE u.id = ${id}`;

    if (loggedUser[0]?.type != TypeUserTransformToEnglish['admin']) {
      const schoolOfUser = await this.prisma.school.findFirst({
        where: {
          OR: [
            {
              managers: {
                some: {
                  userId: id,
                },
              },
            },
            {
              students: {
                some: {
                  userId: id,
                },
              },
            },
            {
              teachers: {
                some: {
                  userId: id,
                },
              },
            },
          ],
        },
      });

      return {
        ...loggedUser[0],
        school: schoolOfUser?.name,
      };
    }

    return loggedUser[0];
  }

  findByEmail(email: string) {
    const user = this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  async findByRecoverToken(token: string) {
    const user = this.prisma.user.findFirst({
      where: {
        recoverToken: token,
      },
    });

    return user;
  }

  async updateRecoverToken(userId: string, recoverToken: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        recoverToken: recoverToken,
      },
    });
  }

  async updateAvatar(userId, avatar) {
    const s3Service = new S3Service();

    const avatarSaved = await s3Service.uploadFile(avatar);
    if (!avatarSaved) {
      throw new Error('Failure saving avatar in bucket');
    }
    const { Location: url } = avatarSaved;

    try {
      const responseUpdateAvatar = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: url,
        },
      });

      if (!responseUpdateAvatar) {
        throw new Error('Avatar update failure');
      }
      return {
        data: responseUpdateAvatar.avatar,
        status: HttpStatus.OK,
        message: 'Avatar atualizado com sucesso.',
      };
    } catch (e) {
      console.log(e);
      throw new Error('Avatar update failure');
    }
  }

  async update(id, updateInfoUser) {
    try {
      const updateData = updateInfoUser;

      const updateUser = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      updateUser.name = updateData.name ? updateData.name : updateUser.name;
      updateUser.phone = updateData.phone ? updateData.phone : updateUser.phone;
      updateUser.gender = updateData.gender
        ? updateData.gender
        : updateUser.gender;
      updateUser.birthDate = updateData.birthDate
        ? new Date(updateData.birthDate)
        : updateUser.birthDate;

      await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: updateUser.name,
          phone: updateUser.phone,
          gender: updateUser.gender,
          birthDate: updateUser.birthDate,
        },
      });

      if (updateData.address) {
        const updateAddress = await this.prisma.address.findFirst({
          where: {
            userId: updateUser.id,
          },
        });

        updateAddress.street = updateData.address.street
          ? updateData.address.street
          : updateAddress.street;
        updateAddress.city = updateData.address.city
          ? updateData.address.city
          : updateAddress.city;
        updateAddress.number = updateData.address.number
          ? updateData.address.number
          : updateAddress.number;
        updateAddress.zipCode = updateData.address.zipCode
          ? updateData.address.zipCode
          : updateAddress.zipCode;
        updateAddress.area = updateData.address.area
          ? updateData.address.area
          : updateAddress.area;
        updateAddress.uf = updateData.address.uf
          ? updateData.address.uf
          : updateAddress.uf;
        updateAddress.labelAddress = updateData.address.labelAddress
          ? updateData.address.labelAddress
          : updateAddress.labelAddress;

        await this.prisma.address.update({
          where: {
            id: updateAddress.id,
          },
          data: {
            street: updateAddress.street,
            city: updateAddress.city,
            number: updateAddress.number,
            zipCode: updateAddress.zipCode,
            area: updateAddress.area,
            uf: updateAddress.uf,
            labelAddress: updateAddress.labelAddress,
          },
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Escola atualizada com sucesso.',
      };
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(userId: string) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!userExists) {
        throw new HttpException(
          'Não foi possível remover. Usuário não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.user.delete({
        where: {
          id: userExists.id,
        },
      });

      let formattedType;
      switch (userExists.type) {
        case 'student':
          formattedType = 'Estudante';
          break;
        case 'teacher':
          formattedType = 'Professor';
          break;
        case 'admin':
          formattedType = 'Administrador';
          break;
        case 'manager':
          formattedType = 'Gestor';
          break;
        default:
          formattedType = 'Usuário';
          break;
      }

      return {
        status: HttpStatus.OK,
        message: `${formattedType} removido com sucesso.`,
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSchoolOfLoggedUser(userId: string) {
    const school = await this.prisma.school.findFirst({
      where: {
        teachers: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!school) {
      throw new HttpException(
        `Erro. Escola não encontrada.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: school,
      status: HttpStatus.OK,
      message: 'Escola retornada com sucesso.',
    };
  }
}
