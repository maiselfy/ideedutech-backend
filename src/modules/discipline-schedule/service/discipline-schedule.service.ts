import { Injectable } from '@nestjs/common';
import { format, parse } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Day } from '@prisma/client';
import { CreateDisciplineScheduleDTO } from '../dtos/create-discipline-schedule.dto';
import { UpdateDisciplineScheduleDto } from '../dtos/update-discipline-schedule.dto';
import { transformDocument } from '@prisma/client/runtime';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DisciplineScheduleService {
  constructor(private prisma: PrismaService) {}

  async create({
    day,
    disciplineId,
    initialHour,
    finishHour,
  }: CreateDisciplineScheduleDTO) {
    const response = await this.prisma.disciplineSchedules.create({
      data: {
        day,
        disciplineId,
        initialHour: initialHour,
        finishHour: finishHour,
      },
    });
    return response;
  }

  async findAll(day: string) {
    const dateDay = parse(day, 'yyyy-MM-dd', new Date());
    const weekDay = format(dateDay, 'EEEE', { locale: ptBR });

    const response = await this.prisma.disciplineSchedules.findMany({
      select: {
        id: true,
        day: true,
        initialHour: true,
        finishHour: true,
        discipline: {
          select: {
            id: true,
            name: true,
            classId: true,
          },
        },
      },
      where: {
        // day: Day[weekDay.toLowerCase()],
        // initialHour: {
        //   lte: dateDay,
        // },
        // finishHour: {
        //   gte: dateDay,
        // },
      },
    });

    return { response };
  }

  findOne(id: number) {
    return `This action returns a #${id} disciplineSchedule`;
  }

  update(id: number, updateDisciplineScheduleDto: UpdateDisciplineScheduleDto) {
    return `This action updates a #${id} disciplineSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} disciplineSchedule`;
  }
}
