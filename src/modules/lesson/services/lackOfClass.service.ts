import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { format, parseISO } from 'date-fns';
import { PrismaService } from 'src/modules/prisma';
import { CreateManyLackLessonDTO } from '../dtos/createManyLackLesson.dto';
import { RemoveLackOfClassDTO } from '../dtos/removeLackOfClass.dto';
import { LessonService } from './lesson.service';

@Injectable()
export class LackOfClassService {
  constructor(
    private prisma: PrismaService,
    private lessonService: LessonService,
  ) {}

  async createMany(createManyLackLesson: CreateManyLackLessonDTO) {
    const data = createManyLackLesson.createLackOfClassDTO;

    const validStudents: string[] = [];

    data.studentId.forEach(async (studentId) => {
      const studentInClass = await this.prisma.discipline.findFirst({
        where: {
          class: {
            students: {
              some: {
                id: studentId,
              },
            },
          },
        },
      });

      if (studentInClass) validStudents.push(studentId);
    });

    const createdLesson = await this.prisma.lesson.create({
      data: createManyLackLesson.createLessonDTO,
    });

    const { id } = createdLesson;

    const formattedDate = format(new Date(data.date), 'dd/MM/yyyy');

    const lacksOfClass = validStudents.map(async (student) => {
      const existsLackForDay = await this.prisma.lackOfClass.findFirst({
        where: {
          lessonId: data.lessonId,
          studentId: student,
          lessonDate: {
            equals: formattedDate,
          },
        },
      });

      if (!existsLackForDay) {
        const lackOfClass = await this.prisma.lackOfClass.create({
          data: {
            ...data,
            lessonDate: formattedDate,
            lessonId: id,
            studentId: student,
          },
        });

        return lackOfClass;
      }
    });

    const formattedData = {
      ...createdLesson,
      ...lacksOfClass,
    };

    return {
      data: formattedData,
      status: HttpStatus.CREATED,
      message: 'Frequência para a aula cadastrada com sucesso.',
    };
  }

  async updateLackOfLesson(
    lessonId: string,
    createManyLackLesson: CreateManyLackLessonDTO,
  ) {
    const data = createManyLackLesson.createLackOfClassDTO;

    const validStudents: string[] = [];

    data.studentId.forEach(async (studentId) => {
      const studentInClass = await this.prisma.discipline.findFirst({
        where: {
          class: {
            students: {
              some: {
                id: studentId,
              },
            },
          },
        },
      });

      if (studentInClass) validStudents.push(studentId);
    });

    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      throw new HttpException(
        'Erro. Aula não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const { id } = lesson;

    const formattedDate = format(new Date(data.date), 'dd/MM/yyyy');

    const lacksOfClass = validStudents.map(async (student) => {
      const existsLackForDay = await this.prisma.lackOfClass.findFirst({
        where: {
          lessonId: id,
          studentId: student,
          lessonDate: {
            equals: formattedDate,
          },
        },
      });

      if (!existsLackForDay) {
        const lackOfClass = await this.prisma.lackOfClass.update({
          data: {
            ...data,
            studentId: student,
          },
          where: {
            id,
          },
        });

        return lackOfClass;
      }
    });

    const formattedData = {
      ...lesson,
      ...lacksOfClass,
    };

    return {
      data: formattedData,
      status: HttpStatus.CREATED,
      message: 'Frequência para a aula atualizada com sucesso.',
    };
  }

  // findAll() {
  //   return `This action returns all lesson`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} lesson`;
  // }

  // update(id: number, updateLessonDto: UpdateLessonDto) {
  //   return `This action updates a #${id} lesson`;
  // }

  async remove(removeLackOfClassDTO: RemoveLackOfClassDTO) {
    const data = removeLackOfClassDTO;

    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: data.lessonId,
      },
    });

    if (!lesson) {
      throw new HttpException(
        'Erro. Aula não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const studentInClass = await this.prisma.discipline.findFirst({
      where: {
        class: {
          students: {
            some: {
              id: data.studentId,
            },
          },
        },
      },
    });

    if (!studentInClass) {
      throw new HttpException(
        'Erro. Estudante não encontrado para a disciplina correspondente.',
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedDate = format(new Date(data.date), 'dd/MM/yyyy');

    const lackOfClass = await this.prisma.lackOfClass.findFirst({
      where: {
        studentId: data.studentId,
        lessonId: data.lessonId,
        lessonDate: {
          equals: formattedDate,
        },
      },
    });

    if (!lackOfClass) {
      throw new HttpException(
        'Erro. Não há registro para esse aluno, no dia dessa aula correspondente.',
        HttpStatus.NOT_FOUND,
      );
    }

    const removedLackOfClass = await this.prisma.lackOfClass.delete({
      where: {
        id: lackOfClass.id,
      },
    });

    return {
      data: removedLackOfClass,
      status: HttpStatus.OK,
      message: 'Registro removido da frequência.',
    };
  }
}