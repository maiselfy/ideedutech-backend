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
      where: {
        school: {
          id: schoolId,
        },
      },
      include: {
        _count: {
          select: {
            students: true,
          },
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
}
