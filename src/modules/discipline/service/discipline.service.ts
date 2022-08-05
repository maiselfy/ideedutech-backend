import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { StudentService } from 'src/modules/student/services/student.service';
import pagination from 'src/utils/pagination';
import { PrismaService } from '../../prisma';
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

      return resultMap;
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
