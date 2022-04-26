import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { Exclude } from 'class-transformer';
import CreateSchoolDTO from '../dtos/createSchool.dto';
import { ManagerService } from 'src/modules/manager/service/manager.service';

@Injectable()
export class SchoolService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
  ) {}
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

  async findAll(managerId: string) {
    const currentManager = await this.prisma.manager.findUnique({
      where: {
        userId: managerId,
      },
    });

    if (!currentManager) {
      throw new HttpException(
        'Acesso negado. O gestor não está cadastrado a esta escola.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const schools = await this.prisma.manager.findFirst({
      select: {
        schools: {
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
            _count: {
              select: { managers: true, teachers: true, students: true },
            },
          },
        },
      },
      where: { userId: managerId },
    });
    console.log(schools);

    // const schools = await this.prisma.school.findMany({
    //   where: {
    //     managers: {
    //       some: {
    //         userId: {
    //           equals: managerId,
    //         },
    //       },
    //     },
    //   },
    //   include: {
    //     address: {
    //       select: {
    //         city: true,
    //         area: true,
    //         createdAt: true,
    //         number: true,
    //         labelAddress: true,
    //         uf: true,
    //         street: true,
    //       },
    //     },
    //     _count: { select: { managers: true, teachers: true, students: true } },
    //   },
    // });

    if (!schools) {
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

  async findSchoolById(id: string, userId: string) {
    const response = await this.prisma.school.findFirst({
      where: { id, managers: { some: { userId } } },
    });
    if (!response) {
      throw new HttpException(
        'School not found in yours schools',
        HttpStatus.BAD_GATEWAY,
      );
    }
    return {
      data: response,
      status: HttpStatus.OK,
      message: 'Escola retornada com sucesso.',
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
