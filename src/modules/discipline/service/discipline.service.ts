import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { StudentService } from 'src/modules/student/services/student.service';
import pagination from 'src/utils/pagination';
import { Discipline, PrismaService } from '../../prisma';
import { CreateDisciplineDTO } from '../dtos/createDiscipline.dto';

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
      const student = await this.prisma.student.findUnique({
        where: {
          userId,
        },
      });

      if (!student) {
        throw new HttpException(
          'Erro. Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      // const disciplinesOfStudent = await this.prisma.discipline.findMany({
      //   where: {
      //     classId: student.classId,
      //   },
      //   select: {
      //     id: true,
      //     name: true,
      //     topic: true,
      //     classId: true,
      //     class: {
      //       select: {
      //         name: true,
      //       },
      //     },
      //     teacher: {
      //       select: {
      //         user: {
      //           select: {
      //             id: true,
      //             name: true,
      //           },
      //         },
      //       },
      //     },
      //     schedules: {
      //       select: {
      //         day: true,
      //         initialHour: true,
      //         finishHour: true,
      //         period: {
      //           select: {
      //             id: true,
      //             name: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      const disciplinesOfStudent = await this.prisma.$queryRaw<
        any[]
      >`select d.id, d."name", d.topic, c."name" as className, u."name" as teacherName, s."day", s."initialHour", s."finishHour", p."name" as periodName from public."Discipline" d inner join "Teacher" t on d."teacherId" = t.id inner join "User" u on u.id  = t."userId" inner join "Class" c on d."classId" = c.id inner join "Schedule" s on d.id = s."disciplineId" inner join "Period" p on s."periodId" = p.id where c.id = ${student.classId}`;

      const formattedData = disciplinesOfStudent.map((discipline) => {
        const newData = {
          ...discipline,
          schedules: [
            {
              day: discipline.day,
              initialHour: discipline.initialHour,
              finishHour: discipline.finishHour,
              period: discipline.periodname,
            },
          ],
        };

        delete newData.day;
        delete newData.initialHour;
        delete newData.finishHour;
        delete newData.periodname;

        return newData;

        // const newData = {
        //   id: discipline.id,
        //   name: discipline.name,
        //   classId: discipline.classId,
        //   className: discipline.class.name,
        //   topic: discipline.topic,
        //   teacherId: discipline.teacher.user.id,
        //   teacherName: discipline.teacher.user.name,
        //   schedules: [
        //     ...discipline.schedules.map((schedule) => {
        //       return {
        //         day: schedule.day,
        //         initialHour: schedule.initialHour,
        //         finishHour: schedule.finishHour,
        //         periodId: schedule.period.id,
        //         period: schedule.period.name,
        //       };
        //     }),
        //   ],
        // };

        // return newData;
      });

      return {
        data: formattedData,
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

  // findOne(id: number) {
  //   return `This action returns a #${id} discipline`;
  // }

  // update(id: number, updateDisciplineDto: UpdateDisciplineDto) {
  //   return `This action updates a #${id} discipline`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} discipline`;
  // }

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
}
