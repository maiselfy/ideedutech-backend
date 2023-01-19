import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { StudentService } from 'src/modules/student/services/student.service';
import CreateEvaluativeDeliveryDTO from '../dtos/evaluativeDelivery.dto';
import SubmissionOfStudentDTO from '../dtos/submissionOfStudent.dto';

@Injectable()
export class EvaluativeDeliveryService {
  constructor(
    private prisma: PrismaService,
    private studentService: StudentService,
  ) {}

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

        // Adicionar eveluative-delivery by teacher com nota, para o boletim
        if (updatedEvaluativeDelivery.rate !== null) {
          this.insertExameInReportCard(data.homeWorkId, data.studentId);
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

      // Adicionar eveluative-delivery by teacher com nota, para o boletim
      if (updatedEvaluativeDelivery.rate !== null) {
        this.insertExameInReportCard(data.homeWorkId, data.studentId);
      }

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

  async insertExameInReportCard(homeWorkId, studentId) {
    const homeWork = await this.prisma.homeWork.findFirst({
      where: {
        id: homeWorkId,
      },
      select: {
        id: true,
        startDate: true,
      },
    });

    const period = await this.prisma
      .$queryRaw`SELECT * FROM "Period" WHERE ${homeWork.startDate} BETWEEN "startOfPeriod" AND "endOfPeriod"`;

    const createdReportCard = await this.prisma.reportCard.create({
      data: {
        periodId: period[0].id,
        homeWorkId: homeWorkId,
        studentId: studentId,
      },
    });

    if (!createdReportCard) {
      throw new HttpException(
        'Não foi possível criar a avaliação, por favor tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createForStudent(submissionOfStudentDTO: SubmissionOfStudentDTO) {
    const data = submissionOfStudentDTO;

    const studentId = await this.studentService.findStudentIdByUserId(
      submissionOfStudentDTO.userId,
    );

    const studentExists = await this.prisma.student.findUnique({
      where: {
        id: studentId.id,
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
        studentId: studentId.id,
        homeWorkId: submissionOfStudentDTO.homeWorkId,
        attachement: submissionOfStudentDTO.attachement,
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

  async findAllSubmissionOfStudent(studentId: string, filters) {
    const submissionOfStudent = await this.prisma.evaluativeDelivery.findMany({
      where: {
        studentId: studentId,
        owner: 'student',
        homeWork: {
          ...filters,
        },
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

  async listStudentSubmissionsByHomeWorkId(userId: string, homeWorkId: string) {
    try {
      const studentId = await this.studentService.findStudentIdByUserId(userId);

      if (studentId) {
        const submissions = await this.listAllStudentSubmissions(
          studentId.id,
          homeWorkId,
        );

        return {
          submissions: submissions,
          status: HttpStatus.OK,
          message: `Submissões retornadas com sucesso.`,
        };
      }

      const allSubmissions = await this.listAllSubmissions(homeWorkId);

      return {
        submissions: allSubmissions,
        status: HttpStatus.OK,
        message: `Submissões retornadas com sucesso.`,
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listAllStudentSubmissions(studentId: string, homeWorkId: string) {
    try {
      const allStudentSubmissions =
        await this.prisma.evaluativeDelivery.findMany({
          where: {
            homeWorkId: homeWorkId,
            studentId: studentId,
          },
          select: {
            stage: true,
            rate: true,
            homeWork: {
              select: {
                type: true,
                name: true,
                description: true,
                attachement: true,
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

      const resultMap = allStudentSubmissions.map((submission) => {
        return {
          discipline: submission.homeWork.discipline.name,
          teacher: submission.homeWork.discipline.teacher.user.name,
          stage: submission.stage,
          rate: submission.rate,
          homeWork: {
            type: submission.homeWork.type,
            name: submission.homeWork.name,
            description: submission.homeWork.description,
            attachement: submission.homeWork.attachement,
          },
        };
      });

      return resultMap;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listAllSubmissions(homeWorkId: string) {
    try {
      const allSubmissions = await this.prisma.evaluativeDelivery.findMany({
        where: {
          homeWorkId: homeWorkId,
        },
        select: {
          stage: true,
          rate: true,
          homeWork: {
            select: {
              type: true,
              name: true,
              description: true,
              attachement: true,
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

      const resultMap = allSubmissions.map((submission) => {
        return {
          discipline: submission.homeWork.discipline.name,
          teacher: submission.homeWork.discipline.teacher.user.name,
          stage: submission.stage,
          rate: submission.rate,
          homeWork: {
            type: submission.homeWork.type,
            name: submission.homeWork.name,
            description: submission.homeWork.description,
            attachement: submission.homeWork.attachement,
          },
        };
      });

      return resultMap;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAttachement(userId: string, homeWorkId, url) {
    try {
      const studentId = await this.studentService.findStudentIdByUserId(userId);

      await this.prisma.evaluativeDelivery.updateMany({
        where: {
          studentId: studentId.id,
          homeWorkId: homeWorkId,
        },
        data: {
          attachement: url,
        },
      });

      return {
        status: HttpStatus.OK,
        message: `Submissão atualizada com sucesso.`,
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
