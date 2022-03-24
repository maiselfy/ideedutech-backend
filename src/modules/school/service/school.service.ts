import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async findAll() {
    const schools = await this.prisma.school.findMany();

    if (!schools) {
      throw new HttpException(
        'Não existem escolas registradas em nossa base de dados.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: schools,
      status: HttpStatus.OK,
      message: 'Escolas retornadas com sucesso.',
    };
  }

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
