import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateTestDTO from '../dtos/createTest.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}
  async create(createTestDTO: CreateTestDTO) {
    const data = createTestDTO;

    if (!data.disciplineId) {
      throw new HttpException(
        'Não é possível criar uma avaliação, esta disciplina não existe.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!data.studentId) {
      throw new HttpException(
        'Não é possível criar uma avaliação, este aluno não existe.',
        HttpStatus.NOT_FOUND,
      );
    }

    //Verificar se o aluno está na disciplina

    const student = await this.prisma.student.findUnique({
      where: {
        id: data.studentId,
      },
      select: {
        class: true,
      },
    });

    // const classActually = await this.prisma.discipline.findUnique({
    //   where: {
    //     id: data.disciplineId,
    //   },
    //   select: {
    //     class: true,

    //   },
    // });

    console.log(student);

    if (!student) {
      throw new HttpException(
        'Não foi possível prosseguir. O estudante não faz parte da turma referenciada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const createdTest = await this.prisma.test.create({
      data: data,
    });

    return {
      data: createdTest,
      status: HttpStatus.CREATED,
      message: 'Nota cadastrada com sucesso.',
    };
  }

  async calculateMeanOfStudentForDiscipline(
    studentId: string,
    disciplineId: string,
  ) {
    const homeWorksWithRate = await this.prisma.submission.findMany({
      where: {
        studentId,
        homeWork: {
          disciplineId: disciplineId,
        },
      },
      include: {
        homeWork: true,
      },
    });

    let sum: number;
    let weight: number;

    homeWorksWithRate.forEach((submission) => {
      sum += submission.rating;
      weight += submission.homeWork.weight;
    });

    const ratesOfStudent = await this.prisma.test.findMany({
      where: {
        studentId,
        disciplineId,
      },
      select: {
        name: true,
        rate: true,
        weight: true,
      },
    });

    ratesOfStudent.forEach((rate) => {
      sum += rate.rate * rate.weight;
      weight += rate.weight;
    });

    const mean = sum / weight;

    return mean.toFixed(2);
  }

  // findAll() {
  //   return `This action returns all test`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} test`;
  // }

  // update(id: number, updateTestDto: UpdateTestDto) {
  //   return `This action updates a #${id} test`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} test`;
  // }
}
