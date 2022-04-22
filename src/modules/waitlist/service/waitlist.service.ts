import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateWaitlistDTO from '../dtos/createWaitlist.dto';

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}
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

  // findOne(id: number) {
  //   return `This action returns a #${id} waitlist`;
  // }

  // update(id: number, updateWaitlistDto: UpdateWaitlistDto) {
  //   return `This action updates a #${id} waitlist`;
  // }
}
