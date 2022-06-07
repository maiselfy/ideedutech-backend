import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { CreateLackOfClassDTO } from '../dtos/createLackOfClass.dto';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { TestDTO } from '../dtos/test.dto';
import { LessonService } from './lesson.service';

@Injectable()
export class LackOfClassService {
  constructor(
    private prisma: PrismaService,
    private lessonService: LessonService,
  ) {}
  async create(testDTO: TestDTO) {
    const data = testDTO.createLackOfClassDTO;

    console.log(data);

    // Verifica se o estudante pertence a turma.

    const validStudents: string[] = [];

    data.studentId.forEach(async (studentId) => {
      const studentInClass = await this.prisma.discipline.findFirst({
        where: {
          class: {
            students: {
              some: {
                id: studentId,
              },
            },
          },
        },
      });

      if (studentInClass) validStudents.push(studentId);
    });

    const createdLesson = await this.lessonService.create(
      testDTO.createLessonDTO,
    );

    const { id } = createdLesson.data;

    // Data de hoje
    const dateFormatted = new Date(data.date);
    // Reseta as horas, minutos, segundos...
    dateFormatted.setHours(0, 0, 0, 0);

    validStudents.forEach(async (student) => {
      const lackOfClass = await this.prisma.lackOfClass.create({
        data: {
          ...data,
          date: dateFormatted,
          lessonId: id,
          studentId: student,
        },
      });
      console.log(lackOfClass);
    });
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

  // remove(id: number) {
  //   return `This action removes a #${id} lesson`;
  // }
}
