import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}
  async create(CreateHomeWorkDTO) {
    const data = CreateHomeWorkDTO;
    console.log('Data: ', data);

    const createdHomeWork = await this.prisma.homeWork.create({
      data: {
        ...data,
      },
    });

    return {
      data: createdHomeWork,
      status: HttpStatus.CREATED,
      mensagem: 'Home Work cadastrada com sucesso',
    };
  }
}
