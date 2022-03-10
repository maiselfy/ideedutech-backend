import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateSchoolDTO from '../dtos/createSchool.dto';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}
  async create(createSchoolDTO: CreateSchoolDTO) {
    const data = createSchoolDTO;

    const createdSchool = await this.prisma.school.create({ data });

    return {
      data: createdSchool,
      status: HttpStatus.CREATED,
      message: 'Escola cadastrada com sucesso.',
    };
  }

  // findAll() {
  //   return `This action returns all school`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} school`;
  // }

  // update(id: number, updateSchoolDto: UpdateSchoolDto) {
  //   return `This action updates a #${id} school`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} school`;
  // }
}
