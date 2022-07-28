import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateEvaluativeDeliveryDTO from '../dtos/evaluativeDelivery.dto';
import SubmissionOfStudentDTO from '../dtos/submissionOfStudent.dto';

@Injectable()
export class EvaluativeDeliveryService {
  constructor(private prisma: PrismaService) {}

  async createForTeacher(
    createEvaluativeDeliveryDTO: CreateEvaluativeDeliveryDTO,
  ) {
    const data = createEvaluativeDeliveryDTO;

    const studentExists = await this.prisma.student.findUnique({
      where: {
        id: data.studentId,
      },
    });

    if (!studentExists) {
      throw new HttpException(
        'Erro. Estudante não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const homeWorkExists = await this.prisma.homeWork.findUnique({
      where: {
        id: data.homeWorkId,
      },
    });

    if (!homeWorkExists) {
      throw new HttpException(
        'Erro. Avaliação não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (homeWorkExists.type !== 'test') {
      const lastSubmissionOfStudent =
        await this.prisma.evaluativeDelivery.findMany({
          where: {
            homeWorkId: homeWorkExists.id,
            owner: 'student',
            stage: {
              in: ['evaluated', 'sent'],
            },
            studentId: studentExists.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        });

      if (!lastSubmissionOfStudent) {
        throw new HttpException(
          'Não há submissões para a atividade.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const evaluativeDeliveryExists =
        await this.prisma.evaluativeDelivery.findFirst({
          where: {
            homeWorkId: data.homeWorkId,
            studentId: data.studentId,
            owner: 'teacher',
            rate: {
              not: null,
            },
          },
        });

      console.log(evaluativeDeliveryExists);

      if (evaluativeDeliveryExists) {
        const updatedEvaluativeDelivery =
          await this.prisma.evaluativeDelivery.update({
            data: {
              ...data,
              owner: 'teacher',
              stage: 'evaluated',
              rate: data.rate,
            },
            where: {
              id: evaluativeDeliveryExists.id,
            },
          });

        if (!updatedEvaluativeDelivery) {
          throw new HttpException(
            'Não foi possível criar a correção, por favor tente novamente.',
            HttpStatus.BAD_REQUEST,
          );
        }

        return {
          data: updatedEvaluativeDelivery,
          status: HttpStatus.CREATED,
          message: 'Correção criada com sucesso.',
        };
      } else {
        const updatedEvaluativeDelivery =
          await this.prisma.evaluativeDelivery.create({
            data: {
              ...data,
              owner: 'teacher',
              stage: 'evaluated',
            },
          });

        if (!updatedEvaluativeDelivery) {
          throw new HttpException(
            'Não foi possível criar a correção, por favor tente novamente.',
            HttpStatus.BAD_REQUEST,
          );
        }

        return {
          data: updatedEvaluativeDelivery,
          status: HttpStatus.CREATED,
          message: 'Correção criada com sucesso.',
        };
      }
    } else {
      const evaluativeDeliveryExists =
        await this.prisma.evaluativeDelivery.findFirst({
          where: {
            homeWorkId: data.homeWorkId,
          },
        });

      const updatedEvaluativeDelivery =
        await this.prisma.evaluativeDelivery.create({
          data: {
            ...data,
            owner: 'teacher',
            stage: 'evaluated',
          },
        });

      if (!updatedEvaluativeDelivery) {
        throw new HttpException(
          'Não foi possível criar a correção, por favor tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: updatedEvaluativeDelivery,
        status: HttpStatus.CREATED,
        message: 'Correção criada com sucesso.',
      };
    }
  }

  async createForStudent(submissionOfStudentDTO: SubmissionOfStudentDTO) {
    const data = submissionOfStudentDTO;

    const studentExists = await this.prisma.student.findUnique({
      where: {
        id: data.studentId,
      },
    });

    if (!studentExists) {
      throw new HttpException(
        'Erro. Estudante não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const homeWorkExists = await this.prisma.homeWork.findUnique({
      where: {
        id: data.homeWorkId,
      },
    });

    if (!homeWorkExists) {
      throw new HttpException(
        'Erro. Avaliação não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const createdSubmission = await this.prisma.evaluativeDelivery.create({
      data: {
        ...data,
        owner: 'student',
        stage: 'sent',
      },
    });

    if (!createdSubmission) {
      throw new HttpException(
        'Não foi possível criar a submissão, por favor tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: createdSubmission,
      status: HttpStatus.CREATED,
      message: 'Submissão realizada com sucesso',
    };
  }

  async findAll() {
    return this.prisma.evaluativeDelivery.findMany();
  }

  async findAllSubmissionOfStudent(studentId: string) {
    const submissionOfStudent = await this.prisma.evaluativeDelivery.findMany({
      where: {
        studentId: studentId,
        owner: 'student',
      },
      select: {
        stage: true,
        rate: true,
        homeWork: {
          select: {
            type: true,
            discipline: {
              select: {
                name: true,
                teacher: {
                  select: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const resultMap = submissionOfStudent.map((submission) => {
      return {
        stage: submission.stage,
        rate: submission.rate,
        typeHomeWork: submission.homeWork.type,
        discipline: submission.homeWork.discipline.name,
        teacher: submission.homeWork.discipline.teacher.user.name,
      };
    });

    return resultMap;
  }
}
