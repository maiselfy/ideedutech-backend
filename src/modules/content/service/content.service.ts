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

  async getSingleContents(disciplineId: string) {
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

    const singleContents = await this.prisma.content.findMany({
      where: {
        registerClass: {
          every: {
            type: 'loose',
          },
        },
        disciplineId,
      },
      select: {
        id: true,
        name: true,
        subContent: true,
        registerClass: {
          select: {
            Lesson: {
              select: {
                id: true,
                name: true,
                description: true,
                notes: true,
                classDate: true,
              },
            },
          },
        },
      },
    });

    const formattedData = singleContents.map((content) => {
      const newData = {
        ...content,
        lesson: content.registerClass.map((registerClass) => {
          const lesson = {
            id: registerClass.Lesson.id,
            name: registerClass.Lesson.name,
            description: registerClass.Lesson.description,
            notes: registerClass.Lesson.notes,
            classDate: registerClass.Lesson.classDate,
          };

          return lesson;
        })[0],
      };

      delete newData.registerClass;

      return newData;
    });

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: 'Conteúdos avulsos para a disciplina retornados com sucesso.',
    };
  }

  async deleteContent(contentId: string) {
    const content = await this.prisma.content.findUnique({
      where: {
        id: contentId,
      },
    });

    if (!content) {
      throw new HttpException(
        'Erro. Conteúdo não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedContent = await this.prisma.content.delete({
      where: {
        id: contentId,
      },
    });

    if (!deletedContent) {
      throw new HttpException(
        'Erro. Não foi possível deletar o conteúdo.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      status: HttpStatus.OK,
      message: 'Conteúdo deletado com sucesso.',
    };
  }
}
