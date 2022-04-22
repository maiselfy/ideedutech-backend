import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import ListEntitiesForSchoolDTO from '../dtos/listEntitiesForSchool.dto';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async create() {}

  async findAll() {}

  async findBySchool({ schoolId, managerId }: ListEntitiesForSchoolDTO) {
    const currentManager = await this.prisma.manager.findUnique({
      where: {
        userId: managerId,
      },
    });

    if (!currentManager) {
      throw new HttpException(
        'Acesso negado. O gestor não está cadastrado a esta escola.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const students = await this.prisma.student.findMany({
      where: { schoolId },
    });

    if (!students) {
      throw new HttpException(
        'Não existem estudantes cadastrados para essa escola',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      data: students,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }
}
