import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
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
