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
          ...createPeriodDto,
          startOfPeriod: new Date(createPeriodDto.startOfPeriod),
          endOfPeriod: new Date(createPeriodDto.endOfPeriod),
        },
      });

      return {
        data: period,
        status: HttpStatus.OK,
        message: 'Perído criado com sucesso',
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

  async deletePeriodById(periodId: string) {
    try {
      const deletedPeriod = await this.prisma.period.delete({
        where: {
          id: periodId,
        },
      });

      if (!deletedPeriod) {
        throw Error('Period not found');
      }

      return {
        status: HttpStatus.OK,
        message: 'Perído deletado com sucesso!',
      };

    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePeriodById(periodId, data) {
    try {
      const updatePeriod = await this.prisma.period.findUnique({
        where: {
          id: periodId
        }
      });

      if (!updatePeriod) {
        throw Error('Period not found');
      }

      updatePeriod.name = data.name ? data.name : updatePeriod.name;
      updatePeriod.startOfPeriod = data.startOfPeriod ? data.startOfPeriod : updatePeriod.startOfPeriod;
      updatePeriod.endOfPeriod = data.endOfPeriod ? data.endOfPeriod : updatePeriod.endOfPeriod;

      await this.prisma.period.update({
        where: {
          id: periodId
        },
        data: {
          name: updatePeriod.name,
          startOfPeriod: updatePeriod.startOfPeriod,
          endOfPeriod: updatePeriod.endOfPeriod
        }
      })

      return {
        status: HttpStatus.OK,
        message: 'Período atualizado com sucesso.',
      };

    } catch(error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllPeriodsBySchoolId(schoolId){
    try {

      const allPeriods = await this.prisma.period.findMany({
        where: {
          schoolId: schoolId
        },
        select: {
          id: true,
          name: true,
          startOfPeriod: true,
          endOfPeriod: true
        }
      });

      return allPeriods

    } catch(error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
