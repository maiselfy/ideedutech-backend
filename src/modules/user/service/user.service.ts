import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import  CreateUserDTO  from '../dtos/createUser.dto';
import { User } from '../entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}
  async create(createUserDto: CreateUserDTO) {
    const hashSalt = Number(process.env.HASH_SALT)
    const data: Prisma.UserUncheckedCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, hashSalt),
      birthDate: new Date(createUserDto.birthDate)
    };

    const createdUser = await this.prisma.user.create({ data });

    const userResponse = {
      ...createdUser,
      password: undefined
    }

    return {
      data: userResponse,
      status: HttpStatus.CREATED,
      message: 'Usuário cadastrado com sucesso.'
    };
  } 

  findAll() {
    return this.prisma.user.findMany();
  }

  findById(id: string) {
    return this.prisma.user.findUnique({where: {
      id
    }});
  }

  findByEmail(email: string) {
    const user = this.prisma.user.findUnique({where: {
      email
    }});
    
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
