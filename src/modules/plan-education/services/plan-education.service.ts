import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreatePlanEducationDTO from '../dtos/createPlan-education.dto';

@Injectable()
export class PlanEducationService {
  constructor(private prisma: PrismaService) {}
  async create(createPlanEducationDTO: CreatePlanEducationDTO) {
    const data = createPlanEducationDTO;
    console.log('DATA PLAN EDUCATION: ', data);
    const createdPlanEducation = await this.prisma.planEducation.create({
      data: {
        ...data,
        periods: {
          create: data.periods,
        },
      },
      include: {
        periods: true,
      },
    });
    return {
      data: createdPlanEducation,
      status: HttpStatus.CREATED,
      message: 'Plano de ensino cadastrado com sucesso.',
    };
  }

  async findAll() {
    return {
      data: await this.prisma.planEducation.findMany(),
      status: HttpStatus.OK,
      message: 'Planos de ensino retornados com sucesso.',
    };
  }

  async findOneById(id: string) {
    const planEducation = await this.prisma.planEducation.findUnique({
      where: {
        id,
      },
    });

    if (!planEducation) {
      throw new HttpException(
        'Esse plano de ensino não está registrado em nossa base de dados. Tente novamente',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: planEducation,
      status: HttpStatus.OK,
      message: 'Plano de ensino retornado com sucesso.',
    };
  }

  async findOneByDiscipline(disciplineId: string) {
    const planEducation = await this.prisma.planEducation.findFirst({
      where: {
        disciplineId,
      },
    });

    if (!planEducation) {
      throw new HttpException(
        'Esse plano de ensino não está registrado em nossa base de dados. Tente novamente',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: planEducation,
      status: HttpStatus.OK,
      message: 'Plano de ensino retornado com sucesso.',
    };
  }

  // update(id: number, updatePlanEducationDto: UpdatePlanEducationDto) {
  //   return `This action updates a #${id} planEducation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} planEducation`;
  // }
}
