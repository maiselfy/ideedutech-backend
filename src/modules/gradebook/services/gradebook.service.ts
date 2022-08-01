import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { CreateGradebookDTO } from '../dtos/createGradebook.dto';

@Injectable()
export class GradebookService {
  constructor(private prisma: PrismaService) {}

  async create(createGradebookDTO: CreateGradebookDTO) {
    const data = createGradebookDTO;

    const student = await this.prisma.student.findUnique({
      where: {
        id: data.studentId,
      },
    });

    if (!student) {
      throw new HttpException(
        'Erro. Estudante não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

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

    const createdGradeBook = await this.prisma.gradebook.create({
      data,
    });

    if (!createdGradeBook) {
      throw new HttpException(
        'Erro ao registrar notas no boletim. Por favor, tente novamente.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // findAll() {
  //   return `This action returns all gradebook`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} gradebook`;
  // }

  // update(id: number, updateGradebookDto: UpdateGradebookDto) {
  //   return `This action updates a #${id} gradebook`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} gradebook`;
  // }
}
