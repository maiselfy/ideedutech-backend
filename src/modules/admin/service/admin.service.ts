import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateAdminDTO from '../dtos/createAdmin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService){}
  async create(createAdminDTO: CreateAdminDTO) {
    const data = createAdminDTO;

    const createdAdmin = await this.prisma.admin.create({ 
      data, 
    });

    return {
      data: createdAdmin,
      status: HttpStatus.CREATED,
      message: 'Administrador cadastrado com sucesso.'
    };
  }

  // findAll() {
  //   return `This action returns all admin`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
