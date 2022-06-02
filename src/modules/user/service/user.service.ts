import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
import { StudentService } from 'src/modules/student/services/student.service';
import { MailerService } from '@nestjs-modules/mailer';
import { threadId } from 'worker_threads';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private studentService: StudentService,
    private mailerService: MailerService,
  ) {}
  async create(createUserDto) {
    const userExistsOnWaitlist = await this.prisma.waitList.findUnique({
      where: { value: createUserDto.email },
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

    // const mail = {
    //   to: createdUser.email,
    //   from: 'noreply@application.com',
    //   subject: 'Cadastro realizado com sucesso',
    //   template: 'email-confirmation',
    //   context: {
    //     token: newData.confirmationToken,
    //   },
    // };

    // await this.mailerService.sendMail(mail);

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

      return {
        data: response,
        status: HttpStatus.CREATED,
        message: 'Professor cadastrado com sucesso.',
      };
    } else if (userExistsOnWaitlist.role === 'student') {
    } else {
      throw new HttpException(
        `Permissões insuficientes, não foi possível prosseguir com o cadastro desse tipo de usuário.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async changePassword(id: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const hashSalt = Number(process.env.HASH_SALT);

    let newPassword: string = await bcrypt.hash(password, hashSalt);

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

  findByEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  findByRecoverToken(recoverToken: string) {
    const user = this.prisma.user.findFirst({
      where: {
        recoverToken: recoverToken,
      },
    });

    return user;
  }

  async updateRecoverToken(email: string, recoverToken: string) {
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        recoverToken: recoverToken,
      },
    });
  }

  async remove(id: string) {
    const deleteUser = await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    if (!deleteUser) {
      throw Error(`User not found `);
    }

    return {
      message: `User removed `,
    };
  }
}
