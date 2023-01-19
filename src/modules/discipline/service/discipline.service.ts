import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { StudentService } from 'src/modules/student/services/student.service';
import pagination from 'src/utils/pagination';
import { CreateDisciplineDTO } from '../dtos/createDiscipline.dto';
import { UpdateDisciplineDTO } from '../dtos/updateDiscipline.dto';

enum Months {
  'Janeiro' = 1,
  'Fevereiro' = 2,
  'Março' = 3,
  'Abril' = 4,
  'Maio' = 5,
  'Junho' = 6,
  'Julho' = 7,
  'Agosto' = 8,
  'Setembro' = 9,
  'Outubro' = 10,
  'Novembro' = 11,
  'Dezembro' = 12,
}

interface AbsenscesPerMonth {
  month: string;
  count: number;
}

interface AbsencesOfStudent {
  id: string;
  name: string;
  avatar: string;
  absences: AbsenscesPerMonth[];
  totalAbsences: number;
}
@Injectable()
export class DisciplineService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
    private studentService: StudentService,
  ) {}
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
        //schedules: { createMany: { data: schedules || [] } },
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

  async findAllDisciplinesByClassId(classId: string) {
    try {
      const disciplines = await this.prisma.discipline.findMany({
        where: {
          classId: classId,
        },
        select: {
          id: true,
          name: true,
          classId: true,
          schedules: true,
          class: {
            select: {
              name: true,
            },
          },
          topic: true,
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
      });
      return disciplines;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllDisciplinesOfStudent(userId: string) {
    try {
      const classId = await this.studentService.findClassByStudentId(userId);

      if (!classId) {
        throw new HttpException(
          'Esta classe não existe para este estudante.',
          HttpStatus.NOT_FOUND,
        );
      }

      const disciplinesOfStudent = await this.findAllDisciplinesByClassId(
        classId.classId,
      );

      if (disciplinesOfStudent.length === 0) {
        throw new HttpException(
          'Nenhuma disciplina encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      const resultMap = disciplinesOfStudent.map((discipline) => {
        return {
          id: discipline.id,
          name: discipline.name,
          classId: discipline.classId,
          className: discipline.class.name,
          topic: discipline.topic,
          teacherId: discipline.teacher.user.id,
          teacherName: discipline.teacher.user.name,
          schedules: discipline.schedules.map((schedule) => {
            return {
              name: schedule.day,
              initialHour: schedule.initialHour,
              finishHour: schedule.finishHour,
            };
          }),
        };
      });

      return {
        data: resultMap,
        status: HttpStatus.CREATED,
        message: 'Disciplinas da turma retornadas com sucesso.',
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Failed!!!', HttpStatus.BAD_REQUEST);
    }
  }

  async findDisciplinesOfClassBySchool(
    { managerId, classId },
    paginationDTO: PaginationDTO,
  ) {
    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const classSchool = await this.prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    await this.managerService.findCurrentManager({
      schoolId: classSchool.schooldId,
      managerId,
    });

    if (!classSchool) {
      throw new HttpException('Esta turma não existe.', HttpStatus.NOT_FOUND);
    }

    const disciplines = await this.prisma.discipline.findMany({
      where: {
        class: {
          id: classId,
          school: {
            id: classSchool.schooldId,
          },
        },
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    if (!disciplines) {
      throw new HttpException(
        'Não existem disciplinas cadastradas para esta turma.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const totalCount = disciplines.length;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: disciplines,
      totalCount,
      page: paginationDTO.page ? page : 1,
      limit: qtd,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Disciplinas retornadas com sucesso.',
    };
  }

  async findAbsencesOfStudentByDiscipline(disciplineId: string) {
    const discipline = await this.prisma.discipline.findUnique({
      where: {
        id: disciplineId,
      },
    });

    if (!discipline) {
      throw new HttpException(
        'Erro. Professor não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const studentsOfDiscipline = await this.prisma.student.findMany({
      where: {
        class: {
          disciplines: {
            some: {
              id: discipline.id,
            },
          },
        },
      },
      select: {
        id: true,
        user: {
          select: {
            avatar: true,
            name: true,
          },
        },
      },
    });

    const absencesOfStudent: AbsencesOfStudent[] = [];

    for (const student of studentsOfDiscipline) {
      const absencesPerMonth = await this.prisma.$queryRaw<
        AbsenscesPerMonth[]
      >`SELECT date_trunc('month', to_date(loc."lessonDate", 'YYYY-MM-DD')) as month, count(loc."studentId") as count
      FROM public."LackOfClass" loc inner join "Lesson" l on loc."lessonId" = l.id
      where loc."studentId" = ${student.id} and l."disciplineId" = ${discipline.id}
      GROUP BY 1`;

      let totalAbsences = 0;

      absencesOfStudent.push({
        id: student.id,
        name: student.user.name,
        avatar: student.user.avatar,
        absences: absencesPerMonth.map((absence) => {
          if (absence.month) {
            const month = parseInt(absence.month.split('-')[1]);
            const formattedMonth = Months[month];

            const newData = {
              month: formattedMonth,
              count: absence.count ? absence.count : 0,
            };

            return newData;
          } else {
            return {
              month: undefined,
              count: 0,
            };
          }
        }),
        totalAbsences:
          absencesPerMonth.length > 0
            ? absencesPerMonth.map((absence) => {
                totalAbsences += absence.count ? absence.count : 0;
                return totalAbsences;
              })[absencesPerMonth.length - 1]
            : 0,
      });
    }

    return {
      data: absencesOfStudent,
      status: HttpStatus.OK,
      message: 'Relatório de frequência retornado com sucesso.',
    };
  }

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

  async updateDiscipline(
    disciplineId: string,
    updateDisciplineDTO: UpdateDisciplineDTO,
  ) {
    try {
      const data = updateDisciplineDTO;

      const disciplineExists = await this.prisma.discipline.findUnique({
        where: {
          id: disciplineId,
        },
      });

      if (!disciplineExists) {
        throw new HttpException(
          `Erro. Disciplina não encontrada`,
          HttpStatus.NOT_FOUND,
        );
      }

      const oldTeacherId = disciplineExists.teacherId;

      if (data.teacherId && data.teacherId !== oldTeacherId) {
        await this.prisma.schedule.deleteMany({
          where: {
            discipline: {
              teacherId: oldTeacherId,
            },
          },
        });

        const updatedDiscipline = await this.prisma.discipline.update({
          where: {
            id: disciplineExists.id,
          },
          data,
        });

        return {
          data: updatedDiscipline,
          status: HttpStatus.OK,
          message:
            'Disciplina atualizada com sucesso. Um novo professor foi alocado.',
        };
      } else {
        const updatedDiscipline = await this.prisma.discipline.update({
          where: {
            id: disciplineExists.id,
          },
          data,
        });

        return {
          data: updatedDiscipline,
          status: HttpStatus.OK,
          message: 'Disciplina atualizada com sucesso.',
        };
      }
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDiscipline(disciplineId: string) {
    const disciplineExists = await this.prisma.discipline.findUnique({
      where: {
        id: disciplineId,
      },
      select: {
        id: true,
        name: true,
        topic: true,
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!disciplineExists) {
      throw new HttpException(
        `Erro. Disciplina não encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedData = {
      ...disciplineExists,
      teacher: {
        id: disciplineExists.teacher.id,
        name: disciplineExists.teacher.user.name,
      },
    };

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: 'Disciplina retornada com sucesso.',
    };
  }
}
