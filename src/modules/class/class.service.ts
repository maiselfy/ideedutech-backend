import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
