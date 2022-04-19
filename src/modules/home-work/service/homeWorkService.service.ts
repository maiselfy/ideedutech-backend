import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { HomeWork, Prisma } from '@prisma/client';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}

  async create(createHomeWorkDTO) {
    const data = createHomeWorkDTO;
    console.log('Data CREATE: ', data);

    const createdHomeWork = await this.prisma.homeWork.create({
      data: {
        ...data,
      },
    });

    return {
      data: createdHomeWork,
      status: HttpStatus.CREATED,
      message: 'Home Work Created.',
    };
  }
}
