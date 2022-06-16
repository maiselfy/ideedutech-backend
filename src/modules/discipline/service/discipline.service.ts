import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import pagination from 'src/utils/pagination';
import { PrismaService } from '../../prisma';
import { CreateDisciplineDTO } from '../dtos/createDiscipline.dto';

@Injectable()
export class DisciplineService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
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
        schedules: { createMany: { data: schedules } },
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
