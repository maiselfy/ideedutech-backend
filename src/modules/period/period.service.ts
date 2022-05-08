import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreatePeriodDTO } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';

@Injectable()
export class PeriodService {
  constructor(private prisma: PrismaService) {}
  async create(createPeriodDto: CreatePeriodDTO) {
    try {
      const period = await this.prisma.period.create({
        data: {
          name: createPeriodDto.name,
          schoolId: createPeriodDto.schoolId,
          startOfPeriod: createPeriodDto.startOfPeriod,
          endOfPeriod: createPeriodDto.endOfPeriod,
        },
      });
      return {
        data: period,
        status: HttpStatus.OK,
        message: 'Perído com sucesso',
      };
    } catch (error) {
      if (error) return error;
      return new HttpException(
        'Not able to create a period',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findAll() {
    return `This action returns all period`;
  }

  async findPeriodFromSchool(schoolId: string, schoolYear: string) {
    try {
      const response = await this.prisma.period.findMany({
        where: {
          AND: [
            { school: { id: schoolId } },
            { startOfPeriod: { gte: new Date(Number(schoolYear), 0, 1) } },
            { endOfPeriod: { lte: new Date(Number(schoolYear), 11, 31) } },
          ],
        },
      });
      return { response };
    } catch (error) {}
  }

  findOne(id: number) {
    return `This action returns a #${id} period`;
  }

  update(id: number, updatePeriodDto: UpdatePeriodDto) {
    return `This action updates a #${id} period`;
  }

  remove(id: number) {
    return `This action removes a #${id} period`;
  }
}
