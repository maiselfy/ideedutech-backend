import { Injectable } from '@nestjs/common';
import { ClassScheduleService } from '../class-schedule/class-schedule.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    private prisma: PrismaService,
    private classSchedule: ClassScheduleService,
  ) {}
  async create(createClassDto: CreateClassDto) {
    const response = await this.prisma.class.create({
      data: {
        name: 'Classe Teste',
        schooldId: '73b80736-6f19-4fd8-b8ad-68f9017e8f50',
        teacherId: 'fd2401eb-d53f-487e-b622-79cf45f3d046',
      },
    });
    console.log(response);

    return 'This action adds a new class';
  }

  findAll() {
    return this.prisma.class.findMany();
  }

  async findTeacherClasses(teacherId: string) {
    const classes = await this.prisma.class.findMany({
      select: {
        id: true,
        name: true,
        teacher: {
          select: {
            user: {
              select: { id: true, name: true, email: true, phone: true },
            },
          },
        },
        classes: {
          select: { day: true, initialHour: true, finishHour: true },
        },
      },
      where: { teacherId },
    });
    return classes;
  }

  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    // const response = await this.prisma.class.update({
    //   where: { id },
    //   data: { teacherId: updateClassDto.teacherId },
    // });
    // return response;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
