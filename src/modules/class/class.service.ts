import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import ListEntitiesForSchoolDTO from '../student/dtos/listEntitiesForSchool.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}
  async create(createClassDto: CreateClassDto) {
    const response = await this.prisma.class.create({
      data: {
        name: createClassDto.name,
        schooldId: createClassDto.schoolId,
      },
    });
    return response;
  }
  findAll() {
    return this.prisma.class.findMany();
  }
  findOne(id: number) {
    return `This action returns a #${id} class`;
  }
  async findBySchool({ schoolId, managerId }: ListEntitiesForSchoolDTO) {
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

    const classes = await this.prisma.class.findMany({
      where: { schooldId: schoolId },
    });

    if (!classes) {
      throw new HttpException(
        'Não existem turmas cadastradas para essa escola',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      data: classes,
      status: HttpStatus.OK,
      message: 'Turmas retornados com sucesso.',
    };
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    // const response = await this.prisma.class.update({
    //   where: { id },
    //   data: { teacherId: updateClassDto.teacherId },
    // });
    // return response;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
