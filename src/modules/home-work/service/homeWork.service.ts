import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { PrismaService } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';
import CreateTestDTO from '../dtos/createTest.dto';
import { SearchHomeWorksByTeacherDTO } from '../dtos/searchHomeWorksByTeacher.dto';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}

  async createHomeWork(createHomeWorkDTO: CreateHomeWorkDTO) {
    try {
      const data = createHomeWorkDTO;

      const discipline = await this.prisma.discipline.findUnique({
        where: {
          id: data.disciplineId,
        },
      });

      if (!discipline) {
        throw new HttpException(
          'Erro. Disciplina não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      const createdHomeWork = await this.prisma.homeWork.create({
        data,
      });

      if (!createdHomeWork) {
        throw new HttpException(
          'Não foi possível criar a avaliação, por favor tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: createdHomeWork,
        status: HttpStatus.CREATED,
        message: `${data.type} criada com sucesso.`,
      };
    } catch (error) {
      return new HttpException(
        'Not able to create a home-work',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createTest(createTestDTO: CreateTestDTO) {
    try {
      const data = createTestDTO;

      const discipline = await this.prisma.discipline.findUnique({
        where: {
          id: data.disciplineId,
        },
      });

      if (!discipline) {
        throw new HttpException(
          'Erro. Disciplina não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      const createdTest = await this.prisma.homeWork.create({
        data,
      });

      if (!createdTest) {
        throw new HttpException(
          'Não foi possível criar a avaliação, por favor tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        data: createdTest,
        status: HttpStatus.CREATED,
        message: `${data.type} criada com sucesso.`,
      };
    } catch (error) {
      return new HttpException(
        'Not able to create a home-work',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async listHomeWorksByTeacher(
    teacherId: string,
    searchHomeWorksByTeacher: SearchHomeWorksByTeacherDTO,
  ) {
    try {
      const teacher = await this.prisma.teacher.findFirst({
        where: {
          userId: teacherId,
        },
      });

      if (!teacher) {
        throw new HttpException(
          'Erro. Este professor não existe ou não foi encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const {
        startDate,
        endDate,
        disciplineId,
        classId,
        type,
        isOpen,
        page,
        qtd,
        orderBy,
        sort,
      } = searchHomeWorksByTeacher;

      const paginationDTO: PaginationDTO = {
        page,
        qtd,
        orderBy,
        sort,
      };

      const [pageReturn, qtdReturn, skippedItemsReturn] =
        pagination(paginationDTO);

      const orderByFormatted = {};

      if (orderBy) {
        orderByFormatted[orderBy] = sort ? sort : 'desc';
      }

      const homeWorks = await this.prisma.homeWork.findMany({
        where: {
          discipline: {
            teacherId: teacher.id,
            id: disciplineId ? disciplineId : undefined,
            classId: classId ? classId : undefined,
          },
          dueDate: {
            gte: startDate ? startDate : undefined,
            lte: endDate ? endDate : undefined,
          },
          type: type ? type : undefined,
          isOpen: isOpen ? isOpen : undefined,
        },
        select: {
          id: true,
          name: true,
          isOpen: true,
          type: true,
          dueDate: true,
          description: true,
          discipline: {
            select: {
              name: true,
              class: {
                select: {
                  name: true,
                  _count: true,
                },
              },
            },
          },
        },
        skip: skippedItemsReturn ? skippedItemsReturn : undefined,
        take: qtdReturn ? qtdReturn : undefined,
        orderBy: orderByFormatted
          ? orderByFormatted
          : {
              createdAt: 'desc',
            },
      });

      const formattedData = Promise.allSettled(
        homeWorks.map(async (homeWork) => {
          const evaluativeDelivery =
            await this.prisma.evaluativeDelivery.findMany({
              distinct: ['studentId'],
              where: {
                homeWorkId: homeWork.id,
                owner: 'student',
                stage: {
                  in: ['sent', 'evaluated'],
                },
              },
            });

          const peddingSubmissions =
            homeWork.discipline.class._count.students -
            evaluativeDelivery.length;

          const data = {
            className: homeWork.discipline.class.name,
            qtdStudents: homeWork.discipline.class._count.students,
            disciplineName: homeWork.discipline.name,
            id: homeWork.id,
            name: homeWork.name,
            isOpen: homeWork.isOpen,
            type: homeWork.type,
            dueDate: homeWork.dueDate,
            peddingSubmissions,
          };

          return data;
        }),
      );

      const totalCount = (await formattedData).length;
      const totalPages = Math.round(totalCount / qtdReturn);

      return {
        data: await formattedData,
        totalCount,
        page: pageReturn ? pageReturn : 1,
        limit: qtdReturn,
        totalPages: totalPages > 0 ? totalPages : 1,
        status: HttpStatus.CREATED,
        message: 'Home Works Listadas com sucesso.',
      };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return this.prisma.homeWork.findMany();
  }

  async getHomeWork(homeWorkId: string) {
    const homeWork = await this.prisma.homeWork.findUnique({
      where: {
        id: homeWorkId,
      },
    });

    if (!homeWork) {
      throw new HttpException(
        'Erro. Homework não encontrada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: homeWork,
      status: HttpStatus.OK,
      message: `Homework retornada com sucesso.`,
    };
  }
}
