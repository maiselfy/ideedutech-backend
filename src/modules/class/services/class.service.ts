import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import pagination from 'src/utils/pagination';
import { ManagerService } from '../../manager/service/manager.service';
import { PrismaService } from '../../prisma/prisma.service';
import ListEntitiesForSchoolDTO from '../../student/dtos/listEntitiesForSchool.dto';
import { CreateClassDto } from '../dtos/create-class.dto';
import { UpdateClassDto } from '../dtos/update-class.dto';

@Injectable()
export class ClassService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
  ) {}
  async create(createClassDto: CreateClassDto) {
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
    const currentManager = await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = pagination(paginationDTO);

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

  async update(id: string, updateClassDto: UpdateClassDto) {
    // const response = await this.prisma.class.update({
    //   where: { id },
    //   data: { teacherId: updateClassDto.teacherId },
    // });
    // return response;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
