import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { PrismaService } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { FindLessonsOfTeacherDTO } from '../dtos/findLessonsOfTeacher.dto';
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
            Content: true,
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
      return {
        data: {},
        status: HttpStatus.NO_CONTENT,
      };
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

    const setStudents = new Set();

    const filterStudents = formattedStudents.filter((student) => {
      const duplicatedPerson = setStudents.has(student.id);
      setStudents.add(student.id);
      return !duplicatedPerson;
    });

    formattedData.students = filterStudents;

    delete formattedData.discipline;
    delete formattedData.lackOfClass;
    delete formattedData.LackOfClass;

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: 'Aula retornada com sucesso.',
    };
  }

  async findLessonsOfTeacher(
    userId: string,
    findLessonsOfTeacher: FindLessonsOfTeacherDTO,
  ) {
    const data = findLessonsOfTeacher;

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Professor não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const lessons = await this.prisma.lesson.findMany({
      where: {
        discipline: {
          teacherId: teacher.id,
          id: data?.disciplineId,
        },
        classDate: {
          gte: data?.initialDate,
          lte: data?.finalDate,
        },
      },
      orderBy: {
        classDate: 'asc',
      },
      select: {
        _count: {
          select: {
            LackOfClass: true,
          },
        },
        id: true,
        classDate: true,
        discipline: {
          select: {
            name: true,
            topic: true,
            class: {
              select: {
                name: true,
                school: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        schedule: {
          select: {
            initialHour: true,
            finishHour: true,
          },
        },
        LackOfClass: {
          select: {
            student: {
              select: {
                _count: true,
                id: true,
                enrollment: true,
                user: {
                  select: {
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        RegisterClass: {
          select: {
            Content: {
              select: {
                name: true,
                subContent: true,
              },
            },
          },
        },
      },
    });

    if (!lessons[0]) {
      return {
        data: [],
        status: HttpStatus.NO_CONTENT,
        message: 'Não existem aulas registradas para esta disciplina.',
      };
    }

    const formattedData = lessons.map((lesson) => {
      const newData = {
        numberOfAbsences: lesson._count.LackOfClass,
        classDate: lesson.classDate,
        initialHour: lesson.schedule?.initialHour,
        finishHour: lesson.schedule?.finishHour,
        lackOfClass: lesson.LackOfClass.map((lack) => {
          const formattedLack = {
            studentId: lack.student.id,
            enrollment: lack.student.enrollment,
            name: lack.student.user.name,
            avatar: lack.student.user.avatar,
          };

          return formattedLack;
        }),
        content: {
          name: lesson.RegisterClass[0]?.Content?.name,
          subContent: lesson.RegisterClass[0]?.Content?.subContent,
        },
      };

      return newData;
    });

    return {
      data: {
        discipline: lessons[0].discipline.name,
        topic: lessons[0].discipline.topic,
        class: lessons[0].discipline.class.name,
        school: lessons[0].discipline.class.school.name,
        numberOfLessons: formattedData.length,
        detailOfLessons: formattedData,
      },
      status: HttpStatus.OK,
      message: 'Aulas retornadas com sucesso.',
    };
  }

  async findRegisterClassesOfTeacher(
    userId: string,
    findLessonsOfTeacher: FindLessonsOfTeacherDTO,
  ) {
    const data = findLessonsOfTeacher;

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Professor não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const lessons = await this.prisma.lesson.findMany({
      where: {
        discipline: {
          teacherId: teacher.id,
          id: data?.disciplineId,
        },
        classDate: {
          gte: data?.initialDate,
          lte: data?.finalDate,
        },
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
                school: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        schedule: {
          select: {
            initialHour: true,
            finishHour: true,
          },
        },
        RegisterClass: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!lessons[0]) {
      return {
        data: [],
        status: HttpStatus.NO_CONTENT,
        message: 'Não existem aulas registradas para esta disciplina.',
      };
    }

    const formattedData = lessons.map((lesson) => {
      const newData = {
        id: lesson.id,
        classDate: lesson.classDate,
        discipline: lesson.discipline.name,
        class: lesson.discipline.class.name,
        school: lesson.discipline.class.school.name,
        initialHour: lesson.schedule?.initialHour,
        finishHour: lesson.schedule?.finishHour,
        situationOfLessen: lesson.RegisterClass[0]
          ? 'Aula registrada'
          : new Date() > new Date(lesson.classDate)
          ? 'Aula pendente'
          : 'Aula prevista',
      };

      return newData;
    });

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: 'Aulas retornadas com sucesso.',
    };
  }

  // remove(id: number) {
  //   return `This action removes a #${id} lesson`;
  // }
}
