import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateDisciplineDTO } from '../dtos/createDiscipline.dto';
import { UpdateDisciplineDto } from '../dtos/updateDiscipline.dto';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}
  async create({
    name,
    topic,
    teacherId,
    classId,
    schedules,
  }: CreateDisciplineDTO) {
    const createdDiscipline = await this.prisma.discipline.create({
      data: {
        name,
        topic,
        teacher: { connect: { id: teacherId } },
        class: { connect: { id: classId } },
        schedules: { createMany: { data: schedules } },
      },
    });

    return {
      data: createdDiscipline,
      status: HttpStatus.CREATED,
      message: 'Disciplina cadastrada com sucesso.',
    };
  }

  async findAll() {
    return this.prisma.discipline.findMany();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} discipline`;
  // }

  // update(id: number, updateDisciplineDto: UpdateDisciplineDto) {
  //   return `This action updates a #${id} discipline`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} discipline`;
  // }

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
