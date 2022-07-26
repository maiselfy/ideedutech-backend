import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { UpdateLessonDTO } from '../dtos/updateLesson.dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}
  async create(createLessonDTO: CreateLessonDTO) {
    const data = createLessonDTO;

    const createdLesson = await this.prisma.lesson.create({
      data,
    });

    if (!createdLesson) {
      throw new HttpException(
        'Não foi possível criar a aula, por favor tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: createdLesson,
      status: HttpStatus.CREATED,
      message: 'Aula cadastrada com sucesso.',
    };
  }

  // findAll() {
  //   return `This action returns all lesson`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} lesson`;
  // }

  async updateLesson(lessonId: string, updateLessonDTO: UpdateLessonDTO) {
    const data = updateLessonDTO;

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

    const updatedLesson = await this.prisma.lesson.update({
      data,
      where: {
        id: lesson.id,
      },
    });

    return {
      data: updatedLesson,
      status: HttpStatus.OK,
      message: 'Aula atualizada com sucesso.',
    };
  }

  async detailOfLesson(lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
        classDate: true,
        discipline: {
          select: {
            name: true,
            class: {
              select: {
                name: true,
                students: true,
              },
            },
          },
        },
        RegisterClass: {
          select: {
            content: true,
          },
        },
        notes: true,
        LackOfClass: {
          where: {
            lessonId,
          },
          select: {
            student: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new HttpException(
        'Erro. Aula não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedData = {
      ...lesson,
      discipline: lesson.discipline.name,
      class: lesson.discipline.class.name,
      lackOfClass: lesson.LackOfClass.map((lack) => {
        return {
          ...lack.student,
          lack: true,
        };
      }),
      students: lesson.discipline.class.students,
    };

    delete formattedData.discipline;

    console.log(formattedData);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} lesson`;
  // }
}
