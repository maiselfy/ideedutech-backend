import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}

  async create(createHomeWorkDTO) {
    try {
      const data = createHomeWorkDTO;

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
    } catch (error) {
      return new HttpException(
        'Not able to create a home-work',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return this.prisma.homeWork.findMany();
  }
}
