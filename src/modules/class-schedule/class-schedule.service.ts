import { Injectable } from '@nestjs/common';
import { format, getDay, parse } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { PrismaService } from '../prisma';
import { Day } from '@prisma/client';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';

@Injectable()
export class ClassScheduleService {
  constructor(private prisma: PrismaService) {}
  async create(createClassScheduleDto: CreateClassScheduleDto) {
    await this.prisma.disciplineSchedules.create({
      data: {
        day: 'monday',
        disciplineId: '4667fc77-17f9-455f-9d3e-036931c1eb6d',
        initialHour: new Date('2022-05-01:08:30'),
        finishHour: new Date('2022-05-31:12:30'),
      },
    });
    return 'This action adds a new classSchedule';
  }

  /**
   * dia: segunda
   * initialHour: 8:30,
   * finishHour: 12:30,
   * -> 12/06 -> pesquisar todos os class schedules de segundas feiras, que contenham a data 12/06 entre os seus inital hours e seus finishhours
   */

  async findAll(day: string) {
    const dateDay = parse(day, 'yyyy-MM-dd', new Date());
    const weekDay = format(dateDay, 'EEEE', { locale: ptBR });

    const response = await this.prisma.disciplineSchedules.findMany({
      include: { discipline: true },
      where: {
        day: Day[weekDay.toLowerCase()],
        initialHour: {
          lte: dateDay,
        },
        finishHour: {
          gte: dateDay,
        },
      },
    });

    return { response };
  }

  findOne(id: number) {
    return `This action returns a #${id} classSchedule`;
  }

  update(id: number, updateClassScheduleDto: UpdateClassScheduleDto) {
    return `This action updates a #${id} classSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} classSchedule`;
  }
}
