import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreatePeriodDTO } from '../dtos/create-period.dto';

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
      return new HttpException(error, HttpStatus.BAD_REQUEST);
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
}
