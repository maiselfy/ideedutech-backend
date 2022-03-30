import { HttpStatus, Injectable } from '@nestjs/common';
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
  // findAll() {
  //   return `This action returns all waitlist`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} waitlist`;
  // }

  // update(id: number, updateWaitlistDto: UpdateWaitlistDto) {
  //   return `This action updates a #${id} waitlist`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} waitlist`;
  // }
}
