import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import { PrismaService } from 'src/modules/prisma';
import CreateSchoolDTO from '../dtos/createSchool.dto';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) {}
  async create(createSchoolDTO) {
    const data = createSchoolDTO;

    const createdSchool = await this.prisma.school.create({
      data: {
        ...data,
        address: {
          create: data.address,
        },
      },
      include: {
        address: true,
      },
    });

    return {
      data: createdSchool,
      status: HttpStatus.CREATED,
      message: 'Escola cadastrada com sucesso.',
    };
  }

  async findAll() {
    const schools = await this.prisma.school.findMany({
      include: {
        address: {
          select: {
            city: true,
            area: true,
            createdAt: true,
            number: true,
            labelAddress: true,
            uf: true,
            street: true,
          },
        },
        _count: { select: { managers: true, teachers: true, students: true } },
      },
    });

    console.log(schools);

    if (schools) {
      throw new HttpException(
        {
          error: 'Não existem escolas registradas em nossa base de dados.',
          code: 'Teste',
        },
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
