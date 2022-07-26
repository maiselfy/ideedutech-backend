import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Pagination from 'src/utils/pagination';
import { ManagerService } from '../../manager/service/manager.service';
import { PrismaService } from '../../prisma/prisma.service';
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
    const deleteClass = await this.prisma.class.delete({
      where: {
        id: classId,
      },
    });

    if (!deleteClass) {
      throw Error('Class not found');
    }

    return {
      message: 'Class removed',
    };
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

    const totalCount = classes.length;
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

  async findStudentsByClass(classId: string, paginationDTO: PaginationDTO) {
    const [page, qtd, skippedItems] = Pagination(paginationDTO);

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
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    const formattedStudents = studentsOfClass.map((student) => {
      console.log(student);

      const formattedData = {
        ...student,
        avatar: student.user.avatar,
        name: student.user.name,
      };

      delete formattedData.user;

      return formattedStudents;
    });

    console.log(formattedStudents);

    const totalCount = formattedStudents.length;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: formattedStudents,
      totalCount,
      page,
      limit: qtd,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }
}
