import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import CreateRegisterClassDTO from '../dtos/createRegisterClass.dto';
import UpdateRegisterClassDTO from '../dtos/UpdateRegisterClass.dto';

@Injectable()
export class RegisterClassService {
  constructor(private prisma: PrismaService) {}

  async create(createRegisterClassDTO: CreateRegisterClassDTO) {
    const data = createRegisterClassDTO;

    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: data.lessonId,
      },
    });

    if (!lesson) {
      throw new HttpException(
        'Erro. Aula não encontrada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const period = await this.prisma.period.findFirst({
      where: {
        schedule: {
          every: {
            id: lesson.scheduleId,
          },
        },
      },
    });

    if (!period) {
      throw new HttpException(
        'Erro. Período não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!(data.content && data.subContent)) {
      const content = await this.prisma.content.findUnique({
        where: {
          id: data.contentId,
        },
      });

      if (!content) {
        throw new HttpException(
          'Erro. Conteúdo não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const createdRegisterClass = await this.prisma.registerClass.create({
        data: {
          type: 'planEducation',
          periodId: period.id,
          contentId: data.contentId,
          lessonId: data.lessonId,
        },
      });

      if (!createdRegisterClass) {
        throw new HttpException(
          'Não foi possível criar o registro de aula, por favor tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: createdRegisterClass,
        status: HttpStatus.CREATED,
        message: 'Registro de aula cadastrado com sucesso',
      };
    } else {
      const createdRegisterClass = await this.prisma.registerClass.create({
        data: {
          type: 'loose',
          Period: {
            connect: {
              id: period.id,
            },
          },
          Lesson: {
            connect: {
              id: data.lessonId,
            },
          },
          Content: {
            create: {
              name: data.content,
              disciplineId: lesson.disciplineId,
              subContent: data.subContent,
            },
          },
        },
        include: {
          Content: true,
        },
      });

      if (!createdRegisterClass) {
        throw new HttpException(
          'Não foi possível criar o registro de aula, por favor tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: createdRegisterClass,
        status: HttpStatus.CREATED,
        message: 'Registro de aula avulso cadastrado com sucesso',
      };
    }
  }

  async update(updateRegisterClassDTO: UpdateRegisterClassDTO) {
    const data = updateRegisterClassDTO;

    const registerClass = await this.prisma.registerClass.findFirst({
      where: {
        lessonId: data.lessonId,
      },
    });

    if (!registerClass) {
      throw new HttpException(
        'Erro. Registro de aula não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: registerClass.lessonId,
      },
    });

    if (!lesson) {
      throw new HttpException(
        'Erro. Aula não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const period = await this.prisma.period.findFirst({
      where: {
        schedule: {
          every: {
            id: lesson.scheduleId,
          },
        },
      },
    });

    if (!period) {
      throw new HttpException(
        'Erro. Período não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!(data.content && data.subContent)) {
      const content = await this.prisma.content.findUnique({
        where: {
          id: data.contentId,
        },
      });

      if (!content) {
        throw new HttpException(
          'Erro. Conteúdo não encontrado.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updatedRegisterClass = await this.prisma.registerClass.update({
        data: {
          contentId: data.contentId,
        },
        where: {
          id: registerClass.id,
        },
      });

      if (!updatedRegisterClass) {
        throw new HttpException(
          'Não foi possível atualizar o registro de aula, por favor tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: updatedRegisterClass,
        status: HttpStatus.CREATED,
        message: 'Registro de aula atualizado com sucesso',
      };
    } else {
      const updatedRegisterClass = await this.prisma.registerClass.update({
        data: {
          Content: {
            create: {
              name: data.content,
              disciplineId: lesson.disciplineId,
              subContent: data.subContent,
            },
          },
        },
        where: {
          id: registerClass.id,
        },
        include: {
          Content: true,
        },
      });

      if (!updatedRegisterClass) {
        throw new HttpException(
          'Não foi possível atualizar o registro de aula, por favor tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: updatedRegisterClass,
        status: HttpStatus.CREATED,
        message: 'Registro de aula avulso atualizado com sucesso',
      };
    }
  }

  async getClassRegistersOfDiscipline(disciplineId: string) {
    const discipline = await this.prisma.discipline.findFirst({
      where: {
        id: disciplineId,
      },
    });

    if (!discipline) {
      throw new HttpException(
        'Erro. Disciplina não encontrada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const classRegisters = await this.prisma.registerClass.findMany({
      where: {
        Lesson: {
          disciplineId,
        },
      },
      select: {
        Content: {
          select: {
            name: true,
            subContent: true,
          },
        },
        Lesson: {
          select: {
            classDate: true,
            notes: true,
          },
        },
      },
    });

    const formattedClassRegisters = classRegisters.map((classRegister) => {
      const newData = {
        content: classRegister.Content.name,
        subContent: classRegister.Content.subContent,
        classDate: classRegister.Lesson.classDate,
        observations: classRegister.Lesson.notes,
      };

      return newData;
    });

    return {
      data: formattedClassRegisters,
      status: HttpStatus.OK,
      message: 'Registros de aula retornados com sucesso.',
    };
  }
}
