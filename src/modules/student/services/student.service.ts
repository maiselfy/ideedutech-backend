import { TypeUser } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { PrismaService } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import { PaginationDTO } from 'src/models/PaginationDTO';
import ListEntitiesForSchoolDTO from '../dtos/listEntitiesForSchool.dto';

import * as bcrypt from 'bcrypt';
import { ClassService } from 'src/modules/class/services/class.service';
import { SchoolService } from 'src/modules/school/service/school.service';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
    private classService: ClassService,
    private schoolService: SchoolService,
  ) {}

  async create(createStudentDTO, managerId: string) {
    const data = createStudentDTO;

    const currentSchool = await this.prisma.school.findFirst({
      where: {
        classes: {
          some: {
            id: data.classId,
          },
        },
      },
    });

    if (!currentSchool) {
      throw new HttpException(
        `Informações inválidas para a turma, não foi possível cadastrar o estudante.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.managerService.findCurrentManager({
      schoolId: currentSchool.id,
      managerId,
    });

    const user = {
      name: data.name,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
    };

    const studentType: TypeUser = 'student';

    const hashSalt = Number(process.env.HASH_SALT);
    const newData = {
      ...user,
      password: await bcrypt.hash(data.password, hashSalt),
      birthDate: new Date(data.birthDate),
      type: studentType,
    };

    const createdUser = await this.prisma.user.create({
      data: {
        ...newData,
        address: {
          create: data.address,
        },
      },
      include: {
        address: true,
      },
    });

    const classExists = await this.prisma.class.findUnique({
      where: {
        id: data.classId,
      },
    });

    if (!classExists) {
      throw new HttpException(
        `Informações inválidas para a turma, não foi possível cadastrar o estudante.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dataStudent = {
      schoolId: currentSchool.id,
      status: true,
      enrollment: data.enrollment,
      classId: data.classId,
      entryForm: data.entryForm,
      reasonForTransfer: data.reasonForTransfer ? data.reasonForTransfer : null,
      userId: createdUser.id,
    };

    const createdStudent = await this.prisma.student.create({
      data: {
        ...dataStudent,
      },

      include: {
        class: true,
      },
    });

    const response = {
      ...createdUser,
      ...createdStudent,
      password: undefined,
    };

    return {
      data: response,
      status: HttpStatus.CREATED,
      message: 'Estudante cadastrado com sucesso.',
    };
  }

  async submitEvaluativeDelivery() {}

  async findBySchool({ schoolId, managerId }: ListEntitiesForSchoolDTO) {
    const currentManager = await this.prisma.manager.findUnique({
      where: {
        userId: managerId,
      },
    });

    if (!currentManager) {
      throw new HttpException(
        'Acesso negado. O gestor não está cadastrado a esta escola.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const students = await this.prisma.student.findMany({
      where: { schoolId },
    });

    if (!students) {
      throw new HttpException(
        'Não existem estudantes cadastrados para essa escola',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      data: students,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }

  async findStudentsBySchool(
    { schoolId, managerId }: ListEntitiesForSchoolDTO,
    paginationDTO: PaginationDTO,
  ) {
    await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const students = await this.prisma.student.findMany({
      where: {
        school: {
          id: schoolId,
        },
      },
      include: {
        class: true,
        user: true,
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    if (!students) {
      throw new HttpException(
        'Não existem estudantes cadastrados para esta escola.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const totalCount = students.length;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: students,
      totalCount: totalCount,
      page: page,
      limit: qtd,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }

  async findStudentsByClass(name: string, classId: string) {
    const students = await this.prisma.student.findMany({
      where: {
        classId,
        user: {
          name: {
            contains: name,
          },
        },
      },
    });

    return {
      data: students,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }

  async findStudentsByClassId(classId: string) {
    const students = await this.prisma.student.findMany({
      where: {
        classId: classId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            birthDate: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
            gender: true,
            type: true,
            avatar: true,
          },
        },
      },
    });

    return {
      data: students,
      status: HttpStatus.OK,
      message: 'Sucess.',
    };
  }

  findByEnrollment(enrollment: string) {
    const student = this.prisma.student.findFirst({
      where: {
        enrollment: enrollment,
      },
      include: {
        user: {
          select: {
            password: true,
          },
        },
      },
    });
    return student;
  }

  async findAllActivities(userId: string, filters) {
    try {
      const studentId = await this.findStudentIdByUserId(userId);

      if (!studentId) {
        throw new HttpException(
          'Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const classId = await this.prisma.student.findFirst({
        where: {
          id: studentId.id,
        },
        select: {
          class: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!classId) {
        throw new HttpException(
          'Classe não encontrada para este estudante.',
          HttpStatus.NOT_FOUND,
        );
      }

      const allActivities = await this.classService.findAllDisciplinesOfClass(
        classId.class.id,
        filters,
      );

      const resultMap = allActivities.disciplines.map((discipline) => {
        return {
          disciplineId: discipline.id,
          name: discipline.name,
          HomeWorks: discipline.homeWorks.map((activities) => {
            return {
              id: activities.id,
              name: activities.name,
              description: activities.description,
              dueDate: activities.dueDate,
              isOpen: activities.isOpen,
              status: this.checkSubmissionStatus(activities.evaluativeDelivery),
            };
          }),
        };
      });

      return resultMap;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Failed!!!', HttpStatus.BAD_REQUEST);
    }
  }

  checkSubmissionStatus(submission) {
    let activitySub = 'Submetida';
    let activityPed = 'Pendente';

    if (submission[0] != undefined) {
      return activitySub;
    } else {
      return activityPed;
    }
  }

  async findStudentIdByUserId(userId: string) {
    const studentId = await this.prisma.student.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    return studentId;
  }

  async findClassByStudentId(userId: string) {
    try {
      const studentId = await this.prisma.student.findFirst({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });

      if (!studentId) {
        throw new HttpException(
          'Erro. Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const classId = await this.prisma.student.findUnique({
        where: {
          id: studentId.id,
        },
        select: {
          classId: true,
        },
      });

      if (!classId) {
        throw new HttpException(
          'Classe não encontrada para este estudante.',
          HttpStatus.NOT_FOUND,
        );
      }

      return classId;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllNotesByPeriod(userId: string) {
    try {
      const studentId = await this.findStudentIdByUserId(userId);

      if (!studentId) {
        throw new HttpException(
          'Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const schoolId = await this.prisma.student.findUnique({
        where: {
          id: studentId.id,
        },
        select: {
          schoolId: true,
        },
      });

      const notesByPeriod = await this.schoolService.findAllPeriod(
        schoolId.schoolId,
      );

      const resultMap = notesByPeriod.Period.map((period) => {
        return {
          name: period.name,
          startOfPeriod: period.startOfPeriod,
          endOfPeriod: period.endOfPeriod,
          disciplineBySchedule: period.schedule.map((disciplineBySchedule) => {
            return {
              name: disciplineBySchedule.discipline.name,
              homeWorks: disciplineBySchedule.discipline.homeWorks.map(
                (homeWork) => {
                  return {
                    name: homeWork.name,
                    description: homeWork.description,
                  };
                },
              ),
            };
          }),
        };
      });

      return notesByPeriod;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async detailOfStudent(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        enrollment: true,
        status: true,
        entryForm: true,
        reasonForTransfer: true,
        class: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                disciplines: true,
              },
            },
          },
        },
        school: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            avatar: true,
            birthDate: true,
            email: true,
            gender: true,
            phone: true,
          },
        },
      },
    });

    if (!student) {
      throw new HttpException(
        'Erro. Estudante não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedDetailOfStudent = {
      ...student,
      name: student.user.name,
      birthDate: student.user.birthDate,
      email: student.user.email,
      gender: student.user.gender,
      phone: student.user.phone,
      class: student.class.name,
      classId: student.class.id,
      qtdDisciplines: student.class._count.disciplines,
      schoolName: student.school.name,
    };

    delete formattedDetailOfStudent.class;
    delete formattedDetailOfStudent.user;
    delete formattedDetailOfStudent.school;

    return {
      data: formattedDetailOfStudent,
      status: HttpStatus.OK,
      message: 'Aluno retornado com sucesso.',
    };
  }

  async updateClassOfStudent(studentId: string, updateStudentDto) {
    try {
      const { newClassId } = updateStudentDto;

      if (!newClassId) {
        await this.prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            classId: null,
          },
        });
      } else {
        await this.prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            classId: newClassId,
          },
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Estudante atualizado com sucesso.',
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
