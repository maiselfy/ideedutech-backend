import { PrismaService } from 'src/modules/prisma';
import { Injectable, HttpStatus } from '@nestjs/common';
import CreateContentDTO from '../dtos/createContent.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}
  async create(createContentDTO: CreateContentDTO) {
    const data = createContentDTO;

    const createdContent = await this.prisma.content.create({
      data: {
        ...data,
      },
    });

    return {
      data: createdContent,
      status: HttpStatus.CREATED,
      message: 'Content Created',
    };
  }

  async findAll() {}

  async findAllContentsPeriodByDisciplineId(
    disciplineId: string,
    periodId: string,
  ) {
    const period = await this.prisma.period.findUnique({
      where: {
        id: periodId,
      },
      select: {
        contents: {
          where: {
            disciplineId: disciplineId,
          },
          include: {
            Period: true,
          },
        },
      },
    });

    if (!period) {
      return {
        data: [],
        status: HttpStatus.NOT_FOUND,
        message: 'Não existem conteúdos criados para esta disciplina.',
      };
    }

    return {
      data: period,
      status: HttpStatus.OK,
      message: 'Conteúdos para a disciplina retornado com sucesso.',
    };
  }
}
