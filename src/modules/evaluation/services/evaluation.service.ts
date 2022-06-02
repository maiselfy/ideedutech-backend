import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateEvaluationDTO from '../dtos/createEvaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}
  async create(createEvaluationDTO: CreateEvaluationDTO) {
    const data = createEvaluationDTO;

    if (!data) {
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

    // const createdTest = await this.prisma.test.create({
    //   data: data,
    // });

    // return {
    //   data: createdTest,
    //   status: HttpStatus.CREATED,
    //   message: 'Avaliação cadastrada com sucesso.',
    // };
  }

  // findAll() {
  //   return `This action returns all evaluation`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} evaluation`;
  // }

  // update(id: number, updateEvaluationDto: UpdateEvaluationDto) {
  //   return `This action updates a #${id} evaluation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} evaluation`;
  // }
}
