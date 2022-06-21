import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
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
      const { startDate, endDate, disciplineId, classId, type, isOpen } =
        searchHomeWorksByTeacher;

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

      const homeWorks = await this.prisma.class.findMany({
        select: {
          _count: {
            select: {
              students: true,
            },
          },
          name: true,
          disciplines: {
            select: {
              name: true,
              homeWorks: {
                select: {
                  id: true,
                  dueDate: true,
                  isOpen: true,
                  name: true,
                  type: true,
                  evaluativeDelivery: {
                    select: {
                      stage: true,
                      id: true,
                      owner: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          disciplines: {
            some: {
              id: disciplineId ? disciplineId : undefined,
              classId: classId ? classId : undefined,
              teacher: {
                id: teacher.id,
              },
              homeWorks: {
                some: {
                  dueDate: {
                    gte: startDate ? startDate : undefined,
                    lte: endDate ? endDate : undefined,
                  },
                  type: type ? type : undefined,
                  isOpen: isOpen ? isOpen : undefined,
                },
              },
            },
          },
        },
      });

      const formattedData = homeWorks.map((homeWork) => {
        const formattedDisciplines = homeWork.disciplines.map((discipline) => {
          const formattedHomeWorks = discipline.homeWorks.map(
            (homeWorkData) => {
              const formatedHomeWork = {
                class: homeWork.name,
                qtdStudents: homeWork._count.students,
                nameDiscipline: discipline.name,
                homeWork: {
                  id: homeWorkData.id,
                  name: homeWorkData.name,
                  isOpen: homeWorkData.isOpen,
                  type: homeWorkData.type,
                  dueDate: homeWorkData.dueDate,
                },
              };
              return formatedHomeWork;
            },
          );
          return formattedHomeWorks;
        });
        return formattedDisciplines;
      });

      return {
        data: formattedData,
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
