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
    schoolId: string,
    teacherId: string,
    managerId: string,
    paginationDTO: PaginationDTO,
  ) {
    await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const classes = await this.prisma.class.findMany({
      where: {
        disciplines: {
          some: {
            teacherId: teacherId,
          },
        },
        schooldId: schoolId,
      },
      include: {
        _count: {
          select: {
            disciplines: true,
            students: true,
          },
        },
        school: {
          select: {
            name: true,
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
        schoolName: classOfSchool?.school?.name,
        qtdStudents: classOfSchool?._count?.students,
        qtdDisciplines: classOfSchool?._count?.disciplines,
      };

      delete formattedClass.school;
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
