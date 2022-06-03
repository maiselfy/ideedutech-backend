import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';
import { SearchHomeWorksByTeacherDTO } from '../dtos/searchHomeWorksByTeacher.dto';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}

  async create(createHomeWorkDTO) {
    try {
      const data = createHomeWorkDTO;

      console.log(data);

      const createdHomeWork = await this.prisma.homeWork.create({
        data,
      });

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

  async listHomeWorksByTeacher(
    teacherId: string,
    searchHomeWorksByTeacher: SearchHomeWorksByTeacherDTO,
  ) {
    try {
      const { startDate, endDate, disciplineId, classId, type, isOpen } =
        searchHomeWorksByTeacher;

      const homeWorks = await this.prisma.discipline.findMany({
        where: {
          teacher: {
            user: {
              id: teacherId,
            },
          },
        },
        select: {
          homeWorks: {
            select: {
              _count: {
                select: {
                  evaluativeDelivery: true,
                },
              },
              id: true,
              discipline: {
                select: {
                  name: true,
                  class: {
                    select: {
                      name: true,
                    },
                  },
                },
              },

              dueDate: true,
              isOpen: true,
              evaluativeDelivery: {
                where: {
                  stage: 'evaluated',
                },
                select: {
                  id: true,
                  stage: true,
                  student: {
                    select: {
                      id: true,
                    },
                  },
                },
              },

              name: true,
            },
            where: {
              dueDate: {
                gte: startDate ? startDate : undefined,
                lte: endDate ? endDate : undefined,
              },
              disciplineId: disciplineId ? disciplineId : undefined,
              type: type ? type : undefined,
              isOpen: isOpen ? isOpen : undefined,
              discipline: {
                classId: classId ? classId : undefined,
              },
            },
          },
        },
      });

      let evaluatedHomeworks = 0;
      let evaluatedTotal = 0;

      homeWorks.forEach((homeWork) => {
        homeWork.homeWorks.map((item) => {
          evaluatedTotal += item._count.evaluativeDelivery;
          const lenghtEvaluetive = item.evaluativeDelivery.length;
          evaluatedHomeworks += lenghtEvaluetive;
        });
      });

      console.log((evaluatedHomeworks / evaluatedTotal) * 100);

      const dataFormatted = {
        ...homeWorks,
        evaluatedHomeworks,
        evaluatedTotal,
      };

      return {
        data: dataFormatted,
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
}
