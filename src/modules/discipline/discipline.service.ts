import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}
  async create({ name, classes, teacherId, schedules }: CreateDisciplineDto) {
    const response = await this.prisma.discipline.create({
      data: {
        name,
        teacher: { connect: { id: teacherId } },
        classes: { connect: classes },
        schedules: { createMany: { data: schedules } },
      },
    });
    return response;
  }

  async findAll() {
    return this.prisma.discipline.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} discipline`;
  }

  update(id: number, updateDisciplineDto: UpdateDisciplineDto) {
    return `This action updates a #${id} discipline`;
  }

  remove(id: number) {
    return `This action removes a #${id} discipline`;
  }
  async findTeacherDisciplines(teacherId: string) {
    const classes = await this.prisma.discipline.findMany({
      select: {
        id: true,
        name: true,
        teacher: {
          select: {
            id: true,
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        schedules: {
          select: { day: true, initialHour: true, finishHour: true },
        },
      },
      where: { teacherId },
    });
    return classes;
  }
}
