import { Role } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { PrismaService } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import CreateWaitlistDTO from '../dtos/createWaitlist.dto';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class WaitlistService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
    private mailerService: MailerService,
  ) {}
  async create(createWaitlistDTO: CreateWaitlistDTO) {
    const data = createWaitlistDTO;

    const existsRegisterOnWaitlist = await this.prisma.waitList.findFirst({
      where: {
        value: data.value,
        schoolId: data.schoolId,
      },
    });

    if (existsRegisterOnWaitlist) {
      throw new HttpException(
        `Este registro já existe para essa escola, por favor altere os dados de email ou matrícula e tente novamente.`,
        HttpStatus.CONFLICT,
      );
    }

    const createdWaitlist = await this.prisma.waitList.create({
      data: {
        ...data,
        approved: false,
      },
    });

    if (!createdWaitlist) {
      throw new HttpException(
        `Erro ao adicionar registro na waitList.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const mail = {
      to: createdWaitlist.value,
      from: 'noreply@application.com',
      subject: 'Adicionado a lista da espera da Instituição',
      template: 'email-confirmation-waitlist',
    };

    await this.mailerService.sendMail(mail);

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
    await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const waitlistLength = await this.prisma.waitList.count({
      where: {
        schoolId,
        role,
      },
    });

    const totalPages = Math.ceil(waitlistLength / qtd) || 1;

    const waitlistFilterResult = await this.prisma.waitList.findMany({
      where: {
        schoolId,
        role,
      },
      orderBy: [{ createdAt: 'desc' }],
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

    return {
      data: waitlistFilterResult,
      totalCount: waitlistFilterResult.length,
      page: page,
      limit: qtd,
      status: HttpStatus.OK,
      totalPages: totalPages,
      message: 'Lista de espera retornada com sucesso',
    };
  }
}
