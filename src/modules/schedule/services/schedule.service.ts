import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  addMinutes,
  eachDayOfInterval,
  eachMinuteOfInterval,
  endOfWeek,
  format,
  startOfWeek,
} from 'date-fns';
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

interface Discipline {
  name: string;
  topic: string;
  teacher: string;
}

interface ScheduleVerify {
  scheduleId: string;
  day: string;
  initialHour: string;
  finishHour: string;
  discipline: Discipline | null;
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

    const existsSchedule = await this.prisma.schedule.findFirst({
      where: {
        OR: [
          // Existe outra aula para essa disciplina, no mesmo dia e horário ?
          {
            disciplineId: data.disciplineId,
            day: data.day,
            periodId: data.periodId,
            OR: [
              // Aula ENTRE os horários.
              {
                AND: [
                  {
                    initialHour: {
                      gt: data.initialHour,
                    },
                  },
                  {
                    finishHour: {
                      lt: data.finishHour,
                    },
                  },
                ],
              },
              // Aula inicia no momento que a outra acaba.
              {
                AND: [
                  {
                    initialHour: {
                      equals: data.finishHour,
                    },
                  },
                  {
                    finishHour: {
                      gt: data.finishHour,
                    },
                  },
                ],
              },
              // Aula finaliza no momento que a outra começa
              {
                AND: [
                  {
                    finishHour: {
                      equals: data.initialHour,
                    },
                  },
                  {
                    initialHour: {
                      gt: data.initialHour,
                    },
                  },
                ],
              },
              {
                AND: [
                  {
                    initialHour: {
                      equals: data.initialHour,
                    },
                  },
                  {
                    finishHour: {
                      lt: data.finishHour,
                    },
                  },
                ],
              },
            ],
          },
          // O professor possuiu outra aula, no mesmo dia e horário ?
          {
            day: data.day,
            periodId: data.periodId,
            OR: [
              // Aula ENTRE os horários.
              {
                AND: [
                  {
                    initialHour: {
                      gt: data.initialHour,
                    },
                  },
                  {
                    finishHour: {
                      lt: data.finishHour,
                    },
                  },
                ],
              },
              // Aula inicia no momento que a outra acaba.
              {
                AND: [
                  {
                    initialHour: {
                      equals: data.finishHour,
                    },
                  },
                  {
                    finishHour: {
                      gt: data.finishHour,
                    },
                  },
                ],
              },
              // Aula finaliza no momento que a outra começa
              {
                AND: [
                  {
                    finishHour: {
                      equals: data.initialHour,
                    },
                  },
                  {
                    initialHour: {
                      gt: data.initialHour,
                    },
                  },
                ],
              },
              {
                AND: [
                  {
                    initialHour: {
                      equals: data.initialHour,
                    },
                  },
                  {
                    finishHour: {
                      lt: data.finishHour,
                    },
                  },
                ],
              },
            ],
            discipline: {
              teacherId: discipline.teacherId,
            },
          },
          // A turma possui alguma disciplina com aula nesse dia e horário ?
          {
            day: data.day,
            periodId: data.periodId,
            discipline: {
              classId: discipline.classId,
            },
            OR: [
              // Aula ENTRE os horários.
              {
                AND: [
                  {
                    initialHour: {
                      gt: data.initialHour,
                    },
                  },
                  {
                    finishHour: {
                      lt: data.finishHour,
                    },
                  },
                ],
              },
              // Aula inicia no momento que a outra acaba.
              {
                AND: [
                  {
                    initialHour: {
                      equals: data.finishHour,
                    },
                  },
                  {
                    finishHour: {
                      gt: data.finishHour,
                    },
                  },
                ],
              },
              // Aula finaliza no momento que a outra começa
              {
                AND: [
                  {
                    finishHour: {
                      equals: data.initialHour,
                    },
                  },
                  {
                    initialHour: {
                      gt: data.initialHour,
                    },
                  },
                ],
              },
              {
                AND: [
                  {
                    initialHour: {
                      equals: data.initialHour,
                    },
                  },
                  {
                    finishHour: {
                      lt: data.finishHour,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!existsSchedule) {
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
    } else {
      throw new HttpException(
        'Erro. Horário indisponível.',
        HttpStatus.CONFLICT,
      );
    }
  }

  async getAvailableSchedules(classId: string, teacherId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Professor não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const classExists = await this.prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!classExists) {
      throw new HttpException(
        'Erro. Turma não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const numberOfToday = new Date().getUTCDay();
    const day = Days[numberOfToday];

    if (
      day === 'monday' ||
      day === 'thursday' ||
      day === 'wednesday' ||
      day === 'tuesday' ||
      day === 'friday' ||
      day === 'saturday' ||
      day === 'sunday'
    ) {
      const schedulesOfWeek: ScheduleVerify[] = [
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '07:00',
          finishHour: '07:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '07:50',
          finishHour: '08:40',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '08:40',
          finishHour: '09:30',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '09:30',
          finishHour: '10:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '10:20',
          finishHour: '11:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '11:10',
          finishHour: '12:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '13:30',
          finishHour: '14:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '14:20',
          finishHour: '15:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '15:10',
          finishHour: '16:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'monday',
          initialHour: '16:00',
          finishHour: '16:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '07:00',
          finishHour: '07:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '07:50',
          finishHour: '08:40',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '08:40',
          finishHour: '09:30',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '09:30',
          finishHour: '10:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '10:20',
          finishHour: '11:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '11:10',
          finishHour: '12:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '13:30',
          finishHour: '14:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '14:20',
          finishHour: '15:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '15:10',
          finishHour: '16:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'thursday',
          initialHour: '16:00',
          finishHour: '16:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '07:00',
          finishHour: '07:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '07:50',
          finishHour: '08:40',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '08:40',
          finishHour: '09:30',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '09:30',
          finishHour: '10:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '10:20',
          finishHour: '11:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '11:10',
          finishHour: '12:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '13:30',
          finishHour: '14:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '14:20',
          finishHour: '15:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '15:10',
          finishHour: '16:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'wednesday',
          initialHour: '16:00',
          finishHour: '16:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '07:00',
          finishHour: '07:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '07:50',
          finishHour: '08:40',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '08:40',
          finishHour: '09:30',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '09:30',
          finishHour: '10:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '10:20',
          finishHour: '11:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '11:10',
          finishHour: '12:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '13:30',
          finishHour: '14:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '14:20',
          finishHour: '15:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '15:10',
          finishHour: '16:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'tuesday',
          initialHour: '16:00',
          finishHour: '16:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '07:00',
          finishHour: '07:50',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '07:50',
          finishHour: '08:40',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '08:40',
          finishHour: '09:30',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '09:30',
          finishHour: '10:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '10:20',
          finishHour: '11:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '11:10',
          finishHour: '12:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '13:30',
          finishHour: '14:20',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '14:20',
          finishHour: '15:10',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '15:10',
          finishHour: '16:00',
          discipline: null,
        },
        {
          scheduleId: null,
          day: 'friday',
          initialHour: '16:00',
          finishHour: '16:50',
          discipline: null,
        },
      ];

      const unavailableSchedules = await this.prisma.schedule.findMany({
        where: {
          OR: [
            // O professor possuiu outra aula
            {
              discipline: {
                teacherId: teacher.id,
              },
            },
            // A turma possui alguma disciplina com aula ?
            {
              discipline: {
                classId: classExists.id,
              },
            },
          ],
        },
        select: {
          id: true,
          day: true,
          initialHour: true,
          finishHour: true,
        },
      });

      schedulesOfWeek.some((freeSchedule, index) => {
        const swapElement = unavailableSchedules.find(
          (unavailableSchedule) =>
            unavailableSchedule.day === freeSchedule.day &&
            unavailableSchedule.initialHour === freeSchedule.initialHour &&
            unavailableSchedule.finishHour === freeSchedule.finishHour,
        );

        if (swapElement) {
          schedulesOfWeek[index] = {
            day: swapElement.day,
            initialHour: swapElement.initialHour,
            finishHour: swapElement.finishHour,
            scheduleId: swapElement.id,
            discipline: null,
          };
        }
      });

      const formattedData = schedulesOfWeek.reduce((acc, element) => {
        const day = schedulesOfWeek.filter((y) => y.day === element.day);
        acc[element.day] = day;
        return acc;
      }, {});

      return {
        data: formattedData,
        status: HttpStatus.OK,
        message: 'Horários retornados com sucesso',
      };
    }
  }

  async getSchedulesOfClass(classId: string) {
    const classExists = await this.prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!classExists) {
      throw new HttpException(
        'Erro. Turma não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const schedulesOfWeek: ScheduleVerify[] = [
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '07:00',
        finishHour: '07:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '07:50',
        finishHour: '08:40',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '08:40',
        finishHour: '09:30',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '09:30',
        finishHour: '10:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '10:20',
        finishHour: '11:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '11:10',
        finishHour: '12:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '13:30',
        finishHour: '14:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '14:20',
        finishHour: '15:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '15:10',
        finishHour: '16:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'monday',
        initialHour: '16:00',
        finishHour: '16:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '07:00',
        finishHour: '07:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '07:50',
        finishHour: '08:40',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '08:40',
        finishHour: '09:30',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '09:30',
        finishHour: '10:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '10:20',
        finishHour: '11:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '11:10',
        finishHour: '12:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '13:30',
        finishHour: '14:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '14:20',
        finishHour: '15:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '15:10',
        finishHour: '16:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'thursday',
        initialHour: '16:00',
        finishHour: '16:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '07:00',
        finishHour: '07:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '07:50',
        finishHour: '08:40',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '08:40',
        finishHour: '09:30',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '09:30',
        finishHour: '10:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '10:20',
        finishHour: '11:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '11:10',
        finishHour: '12:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '13:30',
        finishHour: '14:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '14:20',
        finishHour: '15:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '15:10',
        finishHour: '16:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'wednesday',
        initialHour: '16:00',
        finishHour: '16:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '07:00',
        finishHour: '07:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '07:50',
        finishHour: '08:40',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '08:40',
        finishHour: '09:30',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '09:30',
        finishHour: '10:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '10:20',
        finishHour: '11:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '11:10',
        finishHour: '12:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '13:30',
        finishHour: '14:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '14:20',
        finishHour: '15:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '15:10',
        finishHour: '16:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'tuesday',
        initialHour: '16:00',
        finishHour: '16:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '07:00',
        finishHour: '07:50',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '07:50',
        finishHour: '08:40',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '08:40',
        finishHour: '09:30',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '09:30',
        finishHour: '10:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '10:20',
        finishHour: '11:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '11:10',
        finishHour: '12:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '13:30',
        finishHour: '14:20',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '14:20',
        finishHour: '15:10',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '15:10',
        finishHour: '16:00',
        discipline: null,
      },
      {
        scheduleId: null,
        day: 'friday',
        initialHour: '16:00',
        finishHour: '16:50',
        discipline: null,
      },
    ];

    const unavailableSchedules = await this.prisma.schedule.findMany({
      where: {
        OR: [
          // A turma possui alguma disciplina com aula ?
          {
            discipline: {
              classId: classExists.id,
            },
          },
        ],
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

    schedulesOfWeek.some((freeSchedule, index) => {
      const swapElement = unavailableSchedules.find(
        (unavailableSchedule) =>
          unavailableSchedule.day === freeSchedule.day &&
          unavailableSchedule.initialHour === freeSchedule.initialHour &&
          unavailableSchedule.finishHour === freeSchedule.finishHour,
      );

      if (swapElement) {
        schedulesOfWeek[index] = {
          day: swapElement.day,
          initialHour: swapElement.initialHour,
          finishHour: swapElement.finishHour,
          scheduleId: swapElement.id,
          discipline: {
            name: swapElement.discipline.name,
            topic: swapElement.discipline.topic,
            teacher: swapElement.discipline.teacher.user.name,
          },
        };
      }
    });

    const formattedData = schedulesOfWeek.reduce((acc, element) => {
      const day = schedulesOfWeek.filter((y) => y.day === element.day);
      acc[element.day] = day;
      return acc;
    }, {});

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: 'Horários retornados com sucesso',
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
          lesson: {
            where: {
              classDate: date,
            },
          },
        },
      });

      const formattedData = schedules.map((schedule) => {
        const newData = {
          ...schedule,
          discipline: schedule.discipline.name,
          disciplineId: schedule.discipline.id,
          topic: schedule.discipline.topic,
          class: schedule.discipline.class.name,
          classId: schedule.discipline.class.id,
          date: date,
          lesson: schedule.lesson,
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
}
