import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { UpdateLessonDTO } from '../dtos/updateLesson.dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}
  async create(createLessonDTO: CreateLessonDTO) {
    const data = createLessonDTO;

    const discipline = await this.prisma.discipline.findUnique({
      where: {
        id: data.disciplineId,
      },
    });

    if (!discipline) {
      throw new HttpException(
        'Erro. Disciplina não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const createdLesson = await this.prisma.lesson.create({
      data: {
        ...data,
        classDate: data.classDate
          ? data.classDate
          : new Date().toISOString().split('T')[0],
        LackOfClass: undefined,
      },
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

  // update(id: number, updateLessonDto: UpdateLessonDto) {
  //   return `This action updates a #${id} lesson`;
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

  async detailOfLesson(scheduleId: string, date: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: {
        scheduleId,
        classDate: date,
      },
      select: {
        id: true,
        name: true,
        description: true,
        classDate: true,
        discipline: {
          select: {
            name: true,
            class: {
              select: {
                name: true,
                students: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        name: true,
                        avatar: true,
                      },
                    },
                    enrollment: true,
                  },
                },
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
            lesson: {
              scheduleId,
            },
          },
          select: {
            student: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    avatar: true,
                  },
                },
                enrollment: true,
              },
            },
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
          id: lack.student.id,
          name: lack.student.user.name,
          enrollment: lack.student.enrollment,
          avatar: lack.student.user.avatar,
          lack: true,
        };
      }),
      students: lesson.discipline.class.students.map((student) => {
        return {
          id: student.id,
          name: student.user.name,
          enrollment: student.enrollment,
          avatar: student.user.avatar,
          lack: false,
        };
      }),
    };

    const formattedStudents = formattedData.lackOfClass.concat(
      formattedData.students,
    );

    formattedData.students = formattedStudents;

    delete formattedData.discipline;
    delete formattedData.lackOfClass;
    delete formattedData.LackOfClass;

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: 'Aula retornada com sucesso.',
    };
  }

  // remove(id: number) {
  //   return `This action removes a #${id} lesson`;
  // }
}
