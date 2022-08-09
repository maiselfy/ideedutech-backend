import { PrismaService } from 'src/modules/prisma';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
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

  async findContentsByDiscipline(disciplineId: string) {
    const discipline = await this.prisma.discipline.findUnique({
      where: {
        id: disciplineId,
      },
    });

    if (!discipline) {
      throw new HttpException(
        'Erro. Disciplina não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const contents = await this.prisma.content.findMany({
      where: {
        disciplineId,
      },
      select: {
        id: true,
        name: true,
        subContent: true,
        discipline: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedData = contents.map((content) => {
      const newData = {
        ...content,
        disciplineName: content.discipline.name,
      };

      delete newData.discipline;

      return newData;
    });

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: 'Conteúdos para a disciplina retornados com sucesso.',
    };
  }
}
