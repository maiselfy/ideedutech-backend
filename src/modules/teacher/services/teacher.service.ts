import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { PrismaService } from 'src/modules/prisma';
import ListEntitiesForSchoolDTO from 'src/modules/student/dtos/listEntitiesForSchool.dto';
import pagination from 'src/utils/pagination';

@Injectable()
export class TeacherService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
  ) {}

  async findAllTeachersOnSchool(schoolId: string, userId: string) {
    try {
      const findSchool = await this.prisma.school.findFirst({
        where: { managers: { every: { id: { equals: userId } } } },
      });

      if (!findSchool) {
        throw new HttpException('School not found', HttpStatus.BAD_GATEWAY);
      }

      const response = await this.prisma.teacher.findMany({
        select: { user: true },
        where: { schools: { every: { id: schoolId } } },
      });

      return {
        data: response,
        status: HttpStatus.OK,
        message: 'Professores da Escola Listadas com Sucesso',
      };
    } catch (error) {
      if (error) return error;
      return new HttpException(
        'Fail to list teachers from this school',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async findAll() {
    const teachers = await this.prisma.teacher.findMany();

    if (!teachers) {
      throw new HttpException(
        'Não existem professores registrados em nossa base de dados.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: teachers,
      status: HttpStatus.OK,
      message: 'Professores retornados com sucesso.',
    };
  }

  async findTeachersBySchool(
    { schoolId, managerId }: ListEntitiesForSchoolDTO,
    paginationDTO: PaginationDTO,
  ) {
    await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const teachers = await this.prisma.teacher.findMany({
      select: { user: true, id: true },
      where: {
        schools: {
          some: {
            id: schoolId,
          },
        },
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    if (!teachers) {
      throw new HttpException(
        'Não existem professores cadastrados para esta escola.',
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedTeachers = teachers.reduce((acc, manager) => {
      acc.push({
        id: manager.id,
        userId: manager.user.id,
        name: manager.user.name,
        email: manager.user.email,
        birthDate: manager.user.birthDate,
        phone: manager.user.phone,
        gender: manager.user.gender,
        type: manager.user.type,
        avatar: manager.user.avatar ? manager.user.avatar : '',
      });
      return acc;
    }, []);

    const totalCount = formattedTeachers.length;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: formattedTeachers,
      totalCount: formattedTeachers.length,
      page: paginationDTO.page ? page : 1,
      limit: 5,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Professores retornados com sucesso.',
    };
  }

  async findById(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Não existem professores registrados nesta instituição.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: teacher,
      status: HttpStatus.OK,
      message: `Professor retornado com sucesso.`,
    };
  }

  async findClassesByTeacherOnSchool(
    teacherId: string,
    paginationDTO: PaginationDTO,
  ) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Este professor não existe ou não foi encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const classes = await this.prisma.class.findMany({
      where: {
        disciplines: {
          some: {
            teacherId: teacher.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            disciplines: true,
            students: true,
          },
        },
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    if (!classes) {
      throw new HttpException(
        'Não existem turmas para este professor, nessa escola.',
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedClasses = classes.map((classOfSchool) => {
      const formattedClass = {
        ...classOfSchool,
        qtdStudents: classOfSchool?._count?.students,
        qtdDisciplines: classOfSchool?._count?.disciplines,
      };

      delete formattedClass._count;

      return formattedClass;
    });

    const totalCount = formattedClasses.length;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: formattedClasses,
      totalCount: formattedClasses.length,
      page: paginationDTO.page ? page : 1,
      limit: 5,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Turmas retornadas com sucesso.',
    };
  }

  async findDisciplinesByTeacher(
    teacherId: string,
    paginationDTO: PaginationDTO,
  ) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        userId: teacherId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Erro. Este professor não existe ou não foi encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const disciplines = await this.prisma.discipline.findMany({
      where: {
        teacherId: teacher.id,
      },
      select: {
        id: true,
        name: true,
        topic: true,
        class: {
          select: {
            name: true,
            school: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                students: true,
              },
            },
          },
        },
      },
    });

    if (!disciplines) {
      throw new HttpException(
        'Este professor não possui disciplinas cadastradas.',
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedDisciplines = disciplines.map((discipline) => {
      const formattedData = {
        id: discipline.id,
        name: discipline.name,
        topic: discipline.topic,
        className: discipline.class.name,
        school: discipline.class.school,
        qtdStudents: discipline.class._count.students,
      };

      return formattedData;
    });

    const totalCount = formattedDisciplines.length;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: formattedDisciplines,
      totalCount: formattedDisciplines.length,
      page: paginationDTO.page ? page : 1,
      limit: 5,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Disciplinas retornadas com sucesso.',
    };
  }

  async remove(id: string) {
    const deleteTeacher = await this.prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    if (!deleteTeacher) {
      throw Error(`Teacher ${id} not found `);
    }

    return {
      message: `Teacher ${deleteTeacher} removed `,
    };
  }
}
