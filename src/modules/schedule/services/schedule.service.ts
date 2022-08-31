import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Day, PrismaService } from 'src/modules/prisma';
import { CreateScheduleDTO } from '../dtos/createSchedule.dto';

enum Days {
  'monday' = 1,
  'thursday' = 2,
  'wednesday' = 3,
  'tuesday' = 4,
  'friday' = 5,
  'saturday' = 6,
  'sunday' = 0,
}

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}
  async create(createScheduleDTO: CreateScheduleDTO) {
    const data = createScheduleDTO;

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

    const period = await this.prisma.period.findUnique({
      where: {
        id: data.periodId,
      },
    });

    if (!period) {
      throw new HttpException(
        'Erro. Período não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    // const lesson = await this.prisma.lesson.findFirst({
    //   where: {
    //     disciplineId: discipline.id,
    //   },
    // });

    // if (!lesson) {
    //   throw new HttpException(
    //     'Erro. Aula não encontrada.',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }

    const createdSchedule = await this.prisma.schedule.create({
      data,
    });

    if (!createdSchedule) {
      throw new HttpException(
        'Erro ao criar horário para esta disciplina. Por favor, tente novamente!',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      data: createdSchedule,
      status: HttpStatus.CREATED,
      message: 'Horário para a disciplina cadastrado com sucesso.',
    };
  }

  async getSchedulesOfTeacher(teacherId: string, date: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Professor não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const numberOfDay = new Date(date).getUTCDay();
    const day = Days[numberOfDay];

    if (
      day === 'monday' ||
      day === 'thursday' ||
      day === 'wednesday' ||
      day === 'tuesday' ||
      day === 'friday' ||
      day === 'saturday' ||
      day === 'sunday'
    ) {
      const schedules = await this.prisma.schedule.findMany({
        where: {
          discipline: {
            teacherId: teacher.id,
          },
          day,
        },
        select: {
          id: true,
          day: true,
          initialHour: true,
          finishHour: true,
          discipline: {
            select: {
              id: true,
              name: true,
              topic: true,
              class: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      console.log('schedules', schedules);

      const formattedData = schedules.map((schedule) => {
        const newData = {
          ...schedule,
          discipline: schedule.discipline.name,
          disciplineId: schedule.discipline.id,
          topic: schedule.discipline.topic,
          class: schedule.discipline.class.name,
          classId: schedule.discipline.class.id,
          date: date,
        };

        return newData;
      });

      return {
        data: formattedData,
        status: HttpStatus.OK,
        message: 'Horários do professor retornados com sucesso',
      };
    }
  }

  async getLessonBySchedule(scheduleId: string) {
    console.log(scheduleId);

    const lesson = await this.prisma.lesson.findFirst({
      where: {
        discipline: {
          schedules: {
            some: {
              id: scheduleId,
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

    console.log(lesson);
  }

  async getSchedulesOfStudent(studentId: string, date: string) {
    const student = await this.prisma.student.findUnique({
      where: {
        userId: studentId,
      },
    });

    if (!student) {
      throw new HttpException(
        'Erro. Estudante não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const numberOfDay = new Date(date).getUTCDay();
    const day = Days[numberOfDay];

    if (
      day === 'monday' ||
      day === 'thursday' ||
      day === 'wednesday' ||
      day === 'tuesday' ||
      day === 'friday' ||
      day === 'saturday' ||
      day === 'sunday'
    ) {
      const schedules = await this.prisma.schedule.findMany({
        where: {
          discipline: {
            classId: student.classId,
          },
          day,
        },
        select: {
          id: true,
          day: true,
          initialHour: true,
          finishHour: true,
          discipline: {
            select: {
              name: true,
              topic: true,
              class: {
                select: {
                  id: true,
                  name: true,
                },
              },
              teacher: {
                select: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const formattedData = schedules.map((schedule) => {
        const newData = {
          ...schedule,
          discipline: schedule.discipline.name,
          topic: schedule.discipline.topic,
          class: schedule.discipline.class.name,
          classId: schedule.discipline.class.id,
          teacher: schedule.discipline.teacher.user.name,
          date: date,
        };

        return newData;
      });

      return {
        data: formattedData,
        status: HttpStatus.OK,
        message: 'Horários do aluno retornados com sucesso',
      };
    }
  }

  async getAvailableSchedules(teacherId: string, disciplineId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Professor não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    //Horários disponíveis p/ o dia

    const schedules = await this.prisma.schedule.findMany({
      where: {
        OR: {
          disciplineId,
        },
        discipline: {
          teacher: {
            userId: teacherId,
          },
        },
      },
    });

    // const availableSchedules = await this.prisma.schedule.findMany({
    //   where: {
    //     NOT: {
    //       AND: [{}],
    //     },
    //   },
    // });
  }

  // findAll() {
  //   return `This action returns all schedule`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} schedule`;
  // }

  // update(id: number, updateScheduleDto: UpdateScheduleDto) {
  //   return `This action updates a #${id} schedule`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} schedule`;
  // }
}
