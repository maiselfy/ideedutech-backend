import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import CreateUserDTO from '../dtos/createUser.dto';
import { User } from '../entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto) {
    const { email } = createUserDto;
    console.log(createUserDto.user);

    const data = createUserDto;

    const userExistsOnWaitlist = await this.prisma.waitList.findUnique({
      where: { value: email },
    });

    console.log(userExistsOnWaitlist);

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
    console.log(newData);

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

    console.log('createdUser.id: ', createdUser.id);

    if (userExistsOnWaitlist.role === 'admin') {
      const createdAdmin = await this.prisma.admin.create({
        data: {
          status: true,
          userId: createdUser.id,
          schools: { connect: { id: userExistsOnWaitlist.schoolId } },
        },
        include: { schools: true },
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
        ...createdUser,
        ...createdTeacher,
        password: undefined,
      };

      return {
        data: response,
        status: HttpStatus.CREATED,
        message: 'Professor cadastrado com sucesso.',
      };
    } else {
      throw new HttpException(
        `Permissões insuficientes, não foi possível prosseguir com o cadastro tipo de usuário.`,
        HttpStatus.NOT_FOUND,
      );
    }
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

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
