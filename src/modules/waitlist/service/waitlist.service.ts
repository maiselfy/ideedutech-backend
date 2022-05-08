import { Role } from '@prisma/client';
import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { PrismaService } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import CreateWaitlistDTO from '../dtos/createWaitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
  ) {}
  async create(createWaitlistDTO: CreateWaitlistDTO) {
    const data = createWaitlistDTO;

    const createdWaitlist = await this.prisma.waitList.create({ data });

    return {
      data: createdWaitlist,
      status: HttpStatus.CREATED,
      message: 'Registro adicionado a lista de espera.',
    };
  }

  async findAll() {
    const allWaitlist = await this.prisma.waitList.findMany();

    const waitlistFilterResult = allWaitlist.map((user) => {
      return {
        waitlistEmail: user.value,
        approved: user.approved,
        role: user.role,
        createdAt: user.createdAt,
      };
    });

    return {
      data: waitlistFilterResult,
      status: HttpStatus.OK,
      message: 'Waitlist retornadas com sucesso',
    };
  }

  async remove(email: string) {
    const deleteUserWaitlist = await this.prisma.waitList.delete({
      where: {
        value: email,
      },
    });

    if (!deleteUserWaitlist) {
      throw Error(`User ${email} not found in waitlist`);
    }

    return {
      message: `User ${deleteUserWaitlist.value} removed from waitlist`,
    };
  }

  async findByRole(
    managerId: string,
    role: Role,
    schoolId,
    paginationDTO: PaginationDTO,
  ) {
    const currentManager = await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const waitlistFilterResult = await this.prisma.waitList.findMany({
      where: {
        schoolId,
        role,
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    if (!waitlistFilterResult) {
      return {
        data: [],
        status: HttpStatus.NOT_FOUND,
        message: 'Não há usuários cadastrados nesta lista de espera da escola.',
      };
    }

    const totalPages = Math.round(waitlistFilterResult.length / qtd);

    return {
      data: waitlistFilterResult,
      totalCount: waitlistFilterResult.length,
      page: page,
      limit: qtd,
      status: HttpStatus.OK,
      totalPages: totalPages > 0 ? totalPages : 1,
      message: 'Lista de espera retornada com sucesso',
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} waitlist`;
  // }

  // update(id: number, updateWaitlistDto: UpdateWaitlistDto) {
  //   return `This action updates a #${id} waitlist`;
  // }
}
