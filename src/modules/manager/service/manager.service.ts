import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { PrismaService } from 'src/database/prisma.service';
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

  async findManagersBySchool(
    { schoolId, managerId }: ListEntitiesForSchoolDTO,
    paginationDTO: PaginationDTO,
  ) {
    const [page, qtd, skippedItems] = pagination(paginationDTO);

    await this.findCurrentManager({ schoolId, managerId });

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
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    const countManagers = await this.prisma.manager.count({
      where: {
        schools: {
          every: {
            id: {
              equals: schoolId,
            },
          },
        },
      },
    });

    if (!managers) {
      throw new HttpException(
        'Não existem gestores cadastrados para esta escola.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const formattedManagers = managers.reduce((acc, manager) => {
      acc.push({
        id: manager.user.id,
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

    const totalCount = countManagers;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: formattedManagers,
      totalCount,
      page: page,
      limit: qtd,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Gestores retornados com sucesso.',
    };
  }

  async findCurrentManager({ schoolId, managerId }: ListEntitiesForSchoolDTO) {
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

    return {
      data: currentManager,
    };
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

  async remove(managerId: string) {
    try {
      const managerExists = await this.prisma.manager.findUnique({
        where: {
          id: managerId,
        },
      });

      if (!managerExists) {
        throw new HttpException(
          'Não foi possível remover. Gestor não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.manager.delete({
        where: {
          id: managerExists.id,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Gestor removido com sucesso.',
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
