import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';

@Injectable()
export class RegisterClassService {
  constructor(private prisma: PrismaService) {}

  async create(createRegisterClassDTO) {
    try {
      const data = createRegisterClassDTO;

      const createdRegisterClass = await this.prisma.registerClass.create({
        data: {
          ...data,
        },
      });

      return {
        data: createdRegisterClass,
        status: HttpStatus.CREATED,
        message: 'Registro de aula cadastrado com sucesso',
      };
    } catch (error) {
      return new HttpException(
        'Not able to create a register class',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
