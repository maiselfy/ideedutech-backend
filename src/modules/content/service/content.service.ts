import { PrismaService } from 'src/modules/prisma';
import { Injectable, HttpStatus } from '@nestjs/common';
import CreateContentDTO from '../dtos/createContent.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}
  async create(createContentDTO: CreateContentDTO) {
    const data = createContentDTO;

    const createdContent = await this.prisma.content.create({
      data: {
        ...data,
      },
    });

    return {
      data: createdContent,
      status: HttpStatus.CREATED,
      message: 'Content Created',
    };
  }

  async findAll() {}

  async findAllContentsPeriodByDisciplineId(disciplineId: string) {
    const planEducation = await this.prisma.planEducation.findFirst({
      where: {
        disciplineId,
      },
      select: {
        periods: {
          include: { contents: true },
        },
      },
    });

    if (!planEducation) {
      return {
        data: [],
        status: HttpStatus.OK,
        message: 'Nenhum conteúdo encotrado.',
      };
    }

    return {
      data: planEducation,
      status: HttpStatus.OK,
      message: 'Conteúdo retornado com sucesso.',
    };
  }
}
