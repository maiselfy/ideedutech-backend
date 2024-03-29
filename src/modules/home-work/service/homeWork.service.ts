import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { TypeHomeWork } from '@prisma/client';
import id from 'date-fns/locale/id/index';
import { PrismaService } from 'src/database/prisma.service';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { StudentService } from 'src/modules/student/services/student.service';
import pagination from 'src/utils/pagination';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';
import CreateTestDTO from '../dtos/createTest.dto';
import { SearchHomeWorksByTeacherDTO } from '../dtos/searchHomeWorksByTeacher.dto';

enum TypeHomeWorkTransformToEnglish {
  'activity' = 'Atividade',
  'exame' = 'Prova',
  'work' = 'Trabalho',
  'others' = 'Outros',
  'test' = 'Avaliação',
  'presentation' = 'Apresentação',
}

enum TypeHomeWorkTransformToPortuguese {
  'Atividade' = 'activity',
  'Prova' = 'exame',
  'Trabalho' = 'work',
  'Outros' = 'others',
  'Avaliação' = 'test',
  'Apresentação' = 'presentation',
}
@Injectable()
export class HomeWorkService {
  constructor(
    private prisma: PrismaService,
    private studentService: StudentService,
  ) {}

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

      let aux = [];
      let count = [];
      if (
        TypeHomeWorkTransformToPortuguese[type] == 'activity' ||
        TypeHomeWorkTransformToPortuguese[type] == 'work' ||
        TypeHomeWorkTransformToPortuguese[type] == 'others' ||
        TypeHomeWorkTransformToPortuguese[type] == 'presentation'
      ) {
        aux = await this.prisma.$queryRaw<
          IHomeWorksByTeacher[]
        >`SELECT hw.id, hw."createdAt", hw.name, hw."isOpen", hw."type"::text, hw."dueDate", hw.description, ds."name" as disciplineName, cs.name as className, (select count(*)
        from "Student" s where "classId" = cs.id) as qtdStudents, (select count(distinct ed."studentId") from public."EvaluativeDelivery" ed
        where ed."homeWorkId" = hw.id and ed."owner" = 'Professor' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions
        FROM "HomeWork" hw INNER JOIN "Discipline" ds on ds.id = hw."disciplineId" INNER JOIN "Class" cs on cs.id = ds."classId"
        WHERE  hw."type" = 'Atividade' or  hw."type" = 'Trabalho' or  hw."type" = 'Outros' or  hw."type" = 'Apresentação'
        and ds."teacherId" = ${teacher.id} LIMIT ${qtdReturn} OFFSET(${pageReturn} - 1) * ${qtdReturn}`;

        count = await this.prisma.$queryRaw<
          IHomeWorksByTeacher[]
        >`SELECT hw.id, hw."createdAt", hw.name, hw."isOpen", hw."type"::text, hw."dueDate", hw.description, ds."name" as disciplineName, cs.name as className, (select count(*)
        from "Student" s where "classId" = cs.id) as qtdStudents, (select count(distinct ed."studentId") from public."EvaluativeDelivery" ed
        where ed."homeWorkId" = hw.id and ed."owner" = 'Professor' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions
        FROM "HomeWork" hw INNER JOIN "Discipline" ds on ds.id = hw."disciplineId" INNER JOIN "Class" cs on cs.id = ds."classId"
        WHERE  hw."type" = 'Atividade' or  hw."type" = 'Trabalho' or  hw."type" = 'Outros' or  hw."type" = 'Apresentação'
        and ds."teacherId" = ${teacher.id}`;
      } else if (
        TypeHomeWorkTransformToPortuguese[type] == 'test' ||
        TypeHomeWorkTransformToPortuguese[type] == 'exame'
      ) {
        aux = await this.prisma.$queryRaw<
          IHomeWorksByTeacher[]
        >`SELECT hw.id, hw."createdAt", hw.name, hw."isOpen", hw."type"::text, hw."dueDate", hw.description, ds."name" as disciplineName, cs.name as className, (select count(*)
        from "Student" s where "classId" = cs.id) as qtdStudents, (select count(distinct ed."studentId") from public."EvaluativeDelivery" ed
        where ed."homeWorkId" = hw.id and ed."owner" = 'Professor' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions
        FROM "HomeWork" hw INNER JOIN "Discipline" ds on ds.id = hw."disciplineId" INNER JOIN "Class" cs on cs.id = ds."classId"
        WHERE  hw."type" = 'Avaliação' or  hw."type" = 'Prova'
        and ds."teacherId" = ${teacher.id} LIMIT ${qtdReturn} OFFSET(${pageReturn} - 1) * ${qtdReturn}`;

        count = await this.prisma.$queryRaw<
          IHomeWorksByTeacher[]
        >`SELECT hw.id, hw."createdAt", hw.name, hw."isOpen", hw."type"::text, hw."dueDate", hw.description, ds."name" as disciplineName, cs.name as className, (select count(*)
        from "Student" s where "classId" = cs.id) as qtdStudents, (select count(distinct ed."studentId") from public."EvaluativeDelivery" ed
        where ed."homeWorkId" = hw.id and ed."owner" = 'Professor' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions
        FROM "HomeWork" hw INNER JOIN "Discipline" ds on ds.id = hw."disciplineId" INNER JOIN "Class" cs on cs.id = ds."classId"
        WHERE  hw."type" = 'Avaliação' or  hw."type" = 'Prova'
        and ds."teacherId" = ${teacher.id}`;
      }

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

      const totalCount = count.length;
      const totalPages = Math.round(totalCount / qtdReturn);

      return {
        data: formattedData,
        totalCount,
        page: pageReturn ? pageReturn : 1,
        limit: qtdReturn,
        totalPages: totalPages > 0 ? totalPages : 1,
        status: HttpStatus.OK,
        message: 'Home Works Listadas com sucesso.',
      };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async listHomeWorksByTeacherOnClass(
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

      const count = await this.prisma.$queryRaw<
        IHomeWorksByTeacher[]
      >`Select hw.id, hw.name, hw."isOpen", hw."type", hw."dueDate", hw.description, d."name", c."name", (select count(*) 
    from "Student" s where s."classId" = c.id) as qtdStudents, (select count(distinct ed."studentId") from public."EvaluativeDelivery" ed 
    where ed."homeWorkId" = hw.id and ed."owner" = 'Professor' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions
    from "HomeWork" hw 
    inner join "Discipline" d 
    on hw."disciplineId" = d.id 
    inner join "Class" c 
    on c.id  = d."classId" where c.id = ${classId} and d."teacherId" = ${teacher.id} and hw."type" = ${type}`;

      const query = await this.prisma.$queryRaw<
        IHomeWorksByTeacher[]
      >`Select hw.id, hw.name, hw."isOpen", hw."type", hw."dueDate", hw.description, d."name", c."name", (select count(*) 
      from "Student" s where s."classId" = c.id) as qtdStudents, (select count(distinct ed."studentId") from public."EvaluativeDelivery" ed 
      where ed."homeWorkId" = hw.id and ed."owner" = 'Professor' and ed.stage in ('Enviada', 'Avaliada')) as qtdSubmissions
      from "HomeWork" hw 
      inner join "Discipline" d 
      on hw."disciplineId" = d.id 
      inner join "Class" c 
      on c.id  = d."classId" where c.id = ${classId} and d."teacherId" = ${teacher.id} and hw."type" = ${type} LIMIT ${qtdReturn} OFFSET(${pageReturn} - 1) * ${qtdReturn}`;

      const formattedData = query.map((homeWork) => {
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

      const totalCount = count.length;
      const totalPages = Math.round(totalCount / qtdReturn);

      return {
        data: formattedData,
        totalCount,
        page: pageReturn ? pageReturn : 1,
        limit: qtdReturn,
        totalPages: totalPages > 0 ? totalPages : 1,
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
        id: true,
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
                    EvaluativeDelivery: {
                      where: {
                        OR: [
                          {
                            homeWorkId,
                            stage: {
                              equals: 'evaluated',
                            },
                          },
                          {
                            homeWorkId,
                            stage: {
                              equals: 'sent',
                            },
                          },
                        ],
                      },
                      select: {
                        id: true,
                        rate: true,
                        studentId: true,
                        attachement: true,
                      },
                      orderBy: {
                        createdAt: 'desc',
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
        attachement: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const formattedStudents = homeWork.discipline.class.students.map(
      (student) => {
        const studentId = student.id;

        const submissionOfStudent = student.EvaluativeDelivery.find(
          (submission) => {
            return submission.studentId === studentId;
          },
        );

        const data = {
          id: student.id,
          enrollment: student.enrollment,
          name: student.user.name,
          avatar: student.user.avatar,
          submission: {
            id: submissionOfStudent?.id,
            archive: submissionOfStudent?.attachement,
            rate: submissionOfStudent?.rate,
          },
        };
        return data;
      },
    );

    const formattedData = {
      id: homeWork.id,
      name: homeWork.name,
      description: homeWork.description,
      type: homeWork.type,
      isOpen: homeWork.isOpen,
      dueDate: homeWork.dueDate,
      disciplineName: homeWork.discipline.name,
      className: homeWork.discipline.class.name,
      students: formattedStudents,
      attachment: homeWork.attachement
        ? {
            name: homeWork.attachement.split('_')[1],
            url: homeWork.attachement,
          }
        : null,
      qtdStudents: homeWork.discipline.class.students.length,
      createdAt: homeWork.createdAt,
      updatedAt: homeWork.updatedAt,
      //submissions: formattedEvaluativeDelivery,
      // pendingSubmissions:
      //   homeWork.discipline.class.students.length -
      //   homeWork.evaluativeDelivery.length,
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

  async update(id, updateInfoHomeWork) {
    try {
      const updateData = updateInfoHomeWork;

      const updateHomeWork = await this.prisma.homeWork.findUnique({
        where: {
          id: id,
        },
      });

      if (!updateHomeWork) {
        throw new HttpException(
          'Erro. Atividade ou avaliação não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      updateHomeWork.name = updateData.name
        ? updateData.name
        : updateHomeWork.name;
      updateHomeWork.description = updateData.description
        ? updateData.description
        : updateHomeWork.description;
      updateHomeWork.disciplineId = updateData.disciplineId
        ? updateData.disciplineId
        : updateHomeWork.disciplineId;
      updateHomeWork.startDate = updateData.startDate
        ? updateData.startDate
        : updateHomeWork.startDate;
      updateHomeWork.dueDate = updateData.dueDate
        ? updateData.dueDate
        : updateHomeWork.dueDate;
      updateHomeWork.isOpen = updateData.isOpen
        ? updateData.isOpen
        : updateHomeWork.isOpen;
      updateHomeWork.type = updateData.type
        ? updateData.type
        : updateHomeWork.type;

      if (updateData.isOpen == false) {
        updateHomeWork.isOpen = false;
      }

      await this.prisma.homeWork.update({
        where: {
          id: id,
        },
        data: {
          name: updateHomeWork.name,
          description: updateHomeWork.description,
          disciplineId: updateHomeWork.disciplineId,
          startDate: updateHomeWork.startDate,
          dueDate: updateHomeWork.dueDate,
          isOpen: updateHomeWork.isOpen,
          type: updateHomeWork.type,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'HomeWork atualizada com sucesso.',
      };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteHomework(homeWorkId: string) {
    try {
      const homeWorkExists = await this.prisma.homeWork.findUnique({
        where: {
          id: homeWorkId,
        },
      });

      if (!homeWorkExists) {
        throw new HttpException(
          'Erro. Atividade ou avaliação não encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.homeWork.delete({
        where: {
          id: homeWorkExists.id,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Atividade excluída com sucesso',
      };
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
