import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { HomeWork, PrismaService, TypeHomeWork } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';
import CreateTestDTO from '../dtos/createTest.dto';
import { SearchHomeWorksByTeacherDTO } from '../dtos/searchHomeWorksByTeacher.dto';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}

  async createHomeWork(createHomeWorkDTO: CreateHomeWorkDTO) {
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

  async listactivitiesByTeacher(
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

      // const homeWorks = await this.prisma.homeWork.findMany({

      //   // where: {
      //   //   discipline: {
      //   //     teacherId: teacher.id,
      //   //     id: disciplineId ? disciplineId : undefined,
      //   //     classId: classId ? classId : undefined,
      //   //   },
      //   //   dueDate: {
      //   //     gte: startDate ? startDate : undefined,
      //   //     lte: endDate ? endDate : undefined,
      //   //   },
      //   //   type: type ? type : undefined,
      //   //   isOpen: isOpen ? isOpen : undefined,
      //   // },
      //   select: {
      //     id: true,
      //     name: true,
      //     isOpen: true,
      //     type: true,
      //     dueDate: true,
      //     description: true,
      //     discipline: {
      //       select: {
      //         name: true,
      //         class: {
      //           select: {
      //             name: true,
      //             _count: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      //   // skip: skippedItemsReturn ? skippedItemsReturn : undefined,
      //   // take: qtdReturn ? qtdReturn : undefined,
      //   // orderBy: orderByFormatted
      //   //   ? orderByFormatted
      //   //   : {
      //   //       createdAt: 'desc',
      //   //     },
      // });

      // const teacherId = teacher.id ? teacher.id : '';
      // const disciplineId = disciplineId ? disciplineId : '';
      // const classId = classId ? classId : '';
      // const startDate = startDate ? startDate : '';
      // const endDate = endDate ? endDate : '';
      // const type = type ? type : '';
      // const isOpen = isOpen ? isOpen : '';

      interface IHomeWorksByTeacher {
        id: string;
        name: string;
        isOpen: boolean;
        type: TypeHomeWork;
        dueDate: Date;
        description: string;
        disciplinename: string;
        classname: string;
        disciplineName: string;
        qtdstudents: number;
        qtdsubmissions: number;
        peddingsubmissions: number;
      }

      const aux = await this.prisma.$queryRaw<
        IHomeWorksByTeacher[]
      >`SELECT hw.id, hw.name, hw."isOpen", hw."type", hw."dueDate", hw.description, ds."name" as disciplineName, cs.name as className, (select count(*) from "Student" s
      where "classId" = cs.id) as qtdStudents, (select count(distinct ed."studentId") from "EvaluativeDelivery" ed where ed."homeWorkId" = hw.id and ed."owner"::text = 'Estudante' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions and hw."type"::text = 'Atividade' FROM "HomeWork" hw, "Discipline" ds, "Class" cs
      WHERE hw."disciplineId" = ds.id AND ds."classId" = cs.id and ds."teacherId" = ${teacher.id}`;

      const formattedData = aux.map((homeWork) => {
        const data = {
          ...homeWork,
          className: homeWork.classname,
          disciplineName: homeWork.disciplinename,
          qtdStudents: homeWork.qtdstudents,
          peddingSubmissions:
            Number(homeWork.qtdstudents) - Number(homeWork.qtdsubmissions),
        };

        delete data.qtdsubmissions;
        delete data.qtdstudents;
        delete data.disciplinename;
        delete data.classname;

        return data;
      });

      // const formattedData = Promise.allSettled(
      //   homeWorks.map(async (homeWork) => {
      //     const evaluativeDelivery =
      //       await this.prisma.evaluativeDelivery.findMany({
      //         distinct: ['studentId'],
      //         where: {
      //           homeWorkId: homeWork.id,
      //           owner: 'student',
      //           stage: {
      //             in: ['sent', 'evaluated'],
      //           },
      //         },
      //       });

      //     const peddingSubmissions =
      //       homeWork.discipline.class._count.students -
      //       evaluativeDelivery.length;

      //     const data = {
      //       className: homeWork.discipline.class.name,
      //       qtdStudents: homeWork.discipline.class._count.students,
      //       disciplineName: homeWork.discipline.name,
      //       id: homeWork.id,
      //       name: homeWork.name,
      //       isOpen: homeWork.isOpen,
      //       type: homeWork.type,
      //       dueDate: homeWork.dueDate,
      //       peddingSubmissions,
      //     };

      //     return data;
      //   }),
      // );

      // const totalCount = (await formattedData).length;
      // const totalPages = Math.round(totalCount / qtdReturn);

      return {
        data: formattedData,
        // totalCount,
        // page: pageReturn ? pageReturn : 1,
        // limit: qtdReturn,
        // totalPages: totalPages > 0 ? totalPages : 1,
        status: HttpStatus.OK,
        message: 'Home Works Listadas com sucesso.',
      };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
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

      // const homeWorks = await this.prisma.homeWork.findMany({

      //   // where: {
      //   //   discipline: {
      //   //     teacherId: teacher.id,
      //   //     id: disciplineId ? disciplineId : undefined,
      //   //     classId: classId ? classId : undefined,
      //   //   },
      //   //   dueDate: {
      //   //     gte: startDate ? startDate : undefined,
      //   //     lte: endDate ? endDate : undefined,
      //   //   },
      //   //   type: type ? type : undefined,
      //   //   isOpen: isOpen ? isOpen : undefined,
      //   // },
      //   select: {
      //     id: true,
      //     name: true,
      //     isOpen: true,
      //     type: true,
      //     dueDate: true,
      //     description: true,
      //     discipline: {
      //       select: {
      //         name: true,
      //         class: {
      //           select: {
      //             name: true,
      //             _count: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      //   // skip: skippedItemsReturn ? skippedItemsReturn : undefined,
      //   // take: qtdReturn ? qtdReturn : undefined,
      //   // orderBy: orderByFormatted
      //   //   ? orderByFormatted
      //   //   : {
      //   //       createdAt: 'desc',
      //   //     },
      // });

      // const teacherId = teacher.id ? teacher.id : '';
      // const disciplineId = disciplineId ? disciplineId : '';
      // const classId = classId ? classId : '';
      // const startDate = startDate ? startDate : '';
      // const endDate = endDate ? endDate : '';
      // const type = type ? type : '';
      // const isOpen = isOpen ? isOpen : '';

      interface IHomeWorksByTeacher {
        id: string;
        name: string;
        isOpen: boolean;
        type: TypeHomeWork;
        dueDate: Date;
        description: string;
        disciplinename: string;
        classname: string;
        disciplineName: string;
        qtdstudents: number;
        qtdsubmissions: number;
        peddingsubmissions: number;
      }

      const aux = await this.prisma.$queryRaw<
        IHomeWorksByTeacher[]
      >`SELECT hw.id, hw.name, hw."isOpen", hw."type", hw."dueDate", hw.description, ds."name" as disciplineName, cs.name as className, (select count(*) from "Student" s
      where "classId" = cs.id) as qtdStudents, (select count(distinct ed."studentId") from "EvaluativeDelivery" ed where ed."homeWorkId" = hw.id and ed."owner"::text = 'Professor' and hw."type"::text = 'Atividade' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions FROM "HomeWork" hw, "Discipline" ds, "Class" cs
      WHERE hw."disciplineId" = ds.id AND ds."classId" = cs.id and ds."teacherId" = ${teacher.id}`;

      console.log(aux);

      const formattedData = aux.map((homeWork) => {
        const data = {
          ...homeWork,
          className: homeWork.classname,
          disciplineName: homeWork.disciplinename,
          qtdStudents: homeWork.qtdstudents,
          peddingSubmissions:
            Number(homeWork.qtdstudents) - Number(homeWork.qtdsubmissions),
        };

        delete data.qtdsubmissions;
        delete data.qtdstudents;
        delete data.disciplinename;
        delete data.classname;

        return data;
      });

      // const formattedData = Promise.allSettled(
      //   homeWorks.map(async (homeWork) => {
      //     const evaluativeDelivery =
      //       await this.prisma.evaluativeDelivery.findMany({
      //         distinct: ['studentId'],
      //         where: {
      //           homeWorkId: homeWork.id,
      //           owner: 'student',
      //           stage: {
      //             in: ['sent', 'evaluated'],
      //           },
      //         },
      //       });

      //     const peddingSubmissions =
      //       homeWork.discipline.class._count.students -
      //       evaluativeDelivery.length;

      //     const data = {
      //       className: homeWork.discipline.class.name,
      //       qtdStudents: homeWork.discipline.class._count.students,
      //       disciplineName: homeWork.discipline.name,
      //       id: homeWork.id,
      //       name: homeWork.name,
      //       isOpen: homeWork.isOpen,
      //       type: homeWork.type,
      //       dueDate: homeWork.dueDate,
      //       peddingSubmissions,
      //     };

      //     return data;
      //   }),
      // );

      // const totalCount = (await formattedData).length;
      // const totalPages = Math.round(totalCount / qtdReturn);

      return {
        data: formattedData,
        // totalCount,
        // page: pageReturn ? pageReturn : 1,
        // limit: qtdReturn,
        // totalPages: totalPages > 0 ? totalPages : 1,
        status: HttpStatus.OK,
        message: 'Home Works Listadas com sucesso.',
      };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return this.prisma.homeWork.findMany();
  }

  async getDetailsOfHomework(homeWorkId: string) {
    const homeWork = await this.prisma.homeWork.findUnique({
      where: {
        id: homeWorkId,
      },
      select: {
        discipline: {
          select: {
            class: {
              select: {
                students: {
                  select: {
                    id: true,
                    enrollment: true,
                    user: {
                      select: {
                        avatar: true,
                        name: true,
                      },
                    },
                  },
                },
                name: true,
              },
            },
            name: true,
          },
        },
        type: true,
        isOpen: true,
        dueDate: true,
        description: true,
        name: true,
        evaluativeDelivery: {
          where: {
            homeWorkId,
            owner: 'student',
            stage: {
              in: ['sent', 'evaluated'],
            },
          },
          select: {
            rate: true,
            student: {
              select: {
                id: true,
                enrollment: true,
                user: {
                  select: {
                    avatar: true,
                    name: true,
                  },
                },
              },
            },
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const formattedStudents = homeWork.discipline.class.students.map(
      (student) => {
        const data = {
          id: student.id,
          enrollment: student.enrollment,
          name: student.user.name,
          avatar: student.user.avatar,
        };
        return data;
      },
    );

    const formattedEvaluativeDelivery = homeWork.evaluativeDelivery.map(
      (evaluetive) => {
        const data = {
          id: evaluetive.student.id,
          enrollment: evaluetive.student.enrollment,
          name: evaluetive.student.user.name,
          avatar: evaluetive.student.user.avatar,
          rate: evaluetive.rate,
        };
        return data;
      },
    );

    const formattedData = {
      name: homeWork.name,
      description: homeWork.description,
      type: homeWork.type,
      isOpen: homeWork.isOpen,
      dueDate: homeWork.dueDate,
      disciplineName: homeWork.discipline.name,
      className: homeWork.discipline.class.name,
      students: formattedStudents,
      qtdStudents: homeWork.discipline.class.students.length,
      submissions: formattedEvaluativeDelivery,
      pendingSubmissions:
        homeWork.discipline.class.students.length -
        homeWork.evaluativeDelivery.length,
    };

    if (!formattedData) {
      throw new HttpException(
        'Erro. Homework não encontrada.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: formattedData,
      status: HttpStatus.OK,
      message: `Homework retornada com sucesso.`,
    };
  }
}
