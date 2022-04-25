import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { PrismaService } from 'src/modules/prisma';
import ListEntitiesForSchoolDTO from 'src/modules/student/dtos/listEntitiesForSchool.dto';
import pagination from 'src/utils/pagination';
import { CreateManagerDTO } from '../dtos/createManager.dto';

@Injectable()
export class ManagerService {
  constructor(private prisma: PrismaService) {}
  async create(createManagerDTO: CreateManagerDTO) {
    const data = createManagerDTO;

    const createdManager = await this.prisma.manager.create({
      data,
    });

    return {
      data: createdManager,
      status: HttpStatus.CREATED,
      message: 'Gestor cadastrado com sucesso.',
    };
  }

  async findBySchool(
    { schoolId, managerId }: ListEntitiesForSchoolDTO,
    paginationDTO: PaginationDTO,
  ) {
    const paginable = paginationDTO.paginable === 'true' ? true : false;

    if (paginable) {
      const [page, qtd, skippedItems] = pagination(paginationDTO);

      const currentManager = await this.prisma.manager.findMany({
        where: {
          userId: managerId,
          schools: {
            some: {
              id: {
                equals: schoolId,
              },
            },
          },
        },
      });

      if (!currentManager) {
        throw new HttpException(
          'Acesso negado. O gestor não está cadastrado a esta escola.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const managers = await this.prisma.manager.findMany({
        select: { user: true },
        where: {
          schools: {
            every: {
              id: {
                equals: schoolId,
              },
            },
          },
        },
        skip: paginationDTO.paginable ? skippedItems : undefined,
        take: paginationDTO.paginable ? qtd : undefined,
      });

      if (!managers) {
        throw new HttpException(
          'Não existem gestores cadastrados para essa escola',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return {
        ...paginationDTO,
        data: managers,
        status: HttpStatus.OK,
        message: 'Gestores retornados com sucesso.',
        totalCount: managers.length,
        page: paginationDTO.page ? page : undefined,
        limit: paginationDTO.qtd ? paginationDTO.qtd : undefined,
      };
    }
  }

  // findAll() {
  //   return `This action returns all manager`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} manager`;
  // }

  // update(id: number, updateManagerDto: UpdateManagerDto) {
  //   return `This action updates a #${id} manager`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} manager`;
  // }
}
