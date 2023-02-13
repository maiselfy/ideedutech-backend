import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Pagination from 'src/utils/pagination';
import { ManagerService } from '../../manager/service/manager.service';
import { PrismaService } from 'src/database/prisma.service';
import ListEntitiesForSchoolDTO from '../../student/dtos/listEntitiesForSchool.dto';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { CreateClassDTO } from '../dtos/create-class.dto';

@Injectable()
export class ClassService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
  ) {}
  async create(createClassDto: CreateClassDTO) {
    const response = await this.prisma.class.create({
      data: {
        name: createClassDto.name,
        schooldId: createClassDto.schoolId,
        students: { connect: createClassDto.students },
      },
    });
    return response;
  }
  findAll() {
    return this.prisma.class.findMany();
  }
  findOne(id: number) {
    return `This action returns a #${id} class`;
  }

  async remove(classId: string) {
    try {
      const classExists = await this.prisma.class.findUnique({
        where: {
          id: classId,
        },
      });

      if (!classExists) {
        throw new HttpException(
          'Erro. Turma não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.class.delete({
        where: {
          id: classExists.id,
        },
      });

      return {
        data: HttpStatus.OK,
        message: 'Turma deletada com sucesso.',
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findClassesBySchool(
    { schoolId, managerId }: ListEntitiesForSchoolDTO,
    paginationDTO: PaginationDTO,
  ) {
    await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = Pagination(paginationDTO);

    const classesCount = await this.prisma.class.count({
      where: {
        school: {
          id: schoolId,
        },
      },
    });

    const classes = await this.prisma.class.findMany({
      include: { _count: { select: { students: true } } },
      where: {
        school: {
          id: schoolId,
        },
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    if (!classes) {
      throw new HttpException(
        'Não existem turmas cadastradas para esta escola.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const totalCount = classesCount;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: classes,
      totalCount,
      page,
      limit: qtd,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Turmas retornadas com sucesso.',
    };
  }

  async findStudentsByClass(classId: string) {
    const studentsOfClass = await this.prisma.student.findMany({
      where: {
        classId,
      },
      select: {
        id: true,
        enrollment: true,
        user: {
          select: {
            avatar: true,
            name: true,
          },
        },
      },
    });

    const formattedStudents = studentsOfClass.map((student) => {
      console.log(student);

      const formattedData = {
        ...student,
        avatar: student.user.avatar,
        name: student.user.name,
      };

      delete formattedData.user;

      return formattedData;
    });

    return {
      data: formattedStudents,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }

  async findAllDisciplinesOfClass(classId: string, filters) {
    const allActivitiesByDiscipline = await this.prisma.class.findFirst({
      where: {
        id: classId,
      },
      select: {
        disciplines: {
          select: {
            id: true,
            name: true,
            homeWorks: {
              where: {
                ...filters,
              },
              select: {
                id: true,
                name: true,
                description: true,
                dueDate: true,
                isOpen: true,
                evaluativeDelivery: true,
                attachement: true,
              },
            },
          },
        },
      },
    });

    return allActivitiesByDiscipline;
  }

  async getClassesOfTeacher(teacherId: string, paginationDTO: PaginationDTO) {
    const [page, qtd, skippedItems] = Pagination(paginationDTO);

    const teacher = await this.prisma.teacher.findUnique({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Professor não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const countClassesOfTeacher = await this.prisma.class.count({
      where: {
        disciplines: {
          every: {
            teacher: {
              user: {
                id: teacherId,
              },
            },
          },
        },
      },
    });

    const classesOfTeacher = await this.prisma.class.findMany({
      where: {
        disciplines: {
          every: {
            teacher: {
              user: {
                id: teacherId,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        school: {
          select: {
            name: true,
          },
        },
        disciplines: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
            disciplines: true,
          },
        },
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    const formattedClasses = classesOfTeacher.map((classOfTeacher) => {
      const newData = {
        ...classOfTeacher,
        school: classOfTeacher.school.name,
        qtdStudents: classOfTeacher._count.students,
        disciplines: classOfTeacher.disciplines.map((discipline) => {
          return {
            id: discipline.id,
            name: discipline.name,
          };
        }),
        qtdDisciplines: classOfTeacher._count.disciplines,
      };

      delete newData._count;

      return newData;
    });

    const totalCount = countClassesOfTeacher;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: formattedClasses,
      totalCount,
      page,
      limit: qtd,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Turmas retornadas com sucesso.',
    };
  }

  async detailOfClass(classId: string) {
    const classDetail = await this.prisma.class.findUnique({
      where: {
        id: classId,
      },
      select: {
        id: true,
        name: true,
        school: {
          select: {
            name: true,
          },
        },
        disciplines: {
          select: {
            id: true,
            name: true,
          },
        },
        students: {
          select: {
            id: true,
            enrollment: true,
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            students: true,
            disciplines: true,
          },
        },
      },
    });

    const formattedClassDetail = {
      ...classDetail,
      school: classDetail.school.name,
      students: classDetail.students.map((student) => {
        return {
          id: student.id,
          enrollment: student.enrollment,
          name: student.user.name,
          avatar: student.user.avatar,
        };
      }),
      qtdStudents: classDetail._count.students,
      disciplines: classDetail.disciplines.map((discipline) => {
        return {
          id: discipline.id,
          name: discipline.name,
        };
      }),
      qtdDisciplines: classDetail._count.disciplines,
    };

    delete formattedClassDetail._count;

    return {
      data: formattedClassDetail,
      status: HttpStatus.OK,
      message: 'Turma retornada com sucesso.',
    };
  }

  async updateClass(id, updateInfoClass) {
    try {
      const updateClass = await this.prisma.class.findUnique({
        where: {
          id: id,
        },
      });

      updateClass.name = updateInfoClass.name
        ? updateInfoClass.name
        : updateClass.name;

      await this.prisma.class.update({
        where: {
          id: id,
        },
        data: {
          name: updateClass.name,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Turma atualizada com sucesso.',
      };
    } catch (error) {
      return new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
