import { Class, Gender, Role, School, TypeUser, User } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { PrismaService } from 'src/database/prisma.service';
import pagination from 'src/utils/pagination';
import { PaginationDTO } from 'src/models/PaginationDTO';
import ListEntitiesForSchoolDTO from '../dtos/listEntitiesForSchool.dto';
import { ClassService } from 'src/modules/class/services/class.service';
import { SchoolService } from 'src/modules/school/service/school.service';
import { PeriodService } from 'src/modules/period/service/period.service';

import * as XLSX from 'xlsx';
import * as bcrypt from 'bcrypt';
import UpdateStudentDTO from '../dtos/updateStudent.dto';

interface ReportCard {
  id: string;
  discipline: string;
  mean: string;
}

enum GenderTransform {
  'Masculino' = 'male',
  'Feminino' = 'female',
  'Prefiro Não Informar' = 'notInform',
  'Outros' = 'others',
}

interface AbsenscesPerMonth {
  month: string;
  count: number;
}
interface AbsencesOfStudent {
  months: AbsenscesPerMonth[];
  totalAbsences: number;
}

enum Months {
  'Janeiro' = 1,
  'Fevereiro' = 2,
  'Março' = 3,
  'Abril' = 4,
  'Maio' = 5,
  'Junho' = 6,
  'Julho' = 7,
  'Agosto' = 8,
  'Setembro' = 9,
  'Outubro' = 10,
  'Novembro' = 11,
  'Dezembro' = 12,
}

interface StudentCreateMany {
  schoolId: string;
  classId: string;
  name: string;
  email: string;
  phone: string;
  enrollment: string;
  status: boolean;
  entryForm: string;
  password: string;
  birthDate: Date;
  gender: Gender;
  type: Role;
  labelAddress: string;
  city: string;
  number: string;
  area: string;
  uf: string;
  zipCode: string;
  street: string;
}

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
    private classService: ClassService,
    private schoolService: SchoolService,
    private periodService: PeriodService,
  ) {}

  async create(createStudentDTO, managerId: string) {
    const data = createStudentDTO;

    const currentSchool = await this.prisma.school.findFirst({
      where: {
        classes: {
          some: {
            id: data.classId,
          },
        },
      },
    });

    if (!currentSchool) {
      throw new HttpException(
        `Informações inválidas para a turma, não foi possível cadastrar o estudante.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.managerService.findCurrentManager({
      schoolId: currentSchool.id,
      managerId,
    });

    const user = {
      name: data.name,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
    };

    const studentType: TypeUser = 'student';

    const hashSalt = Number(process.env.HASH_SALT);
    const password = await bcrypt.hash(data.password, hashSalt);
    const newData = {
      ...user,
      password,
      birthDate: new Date(data.birthDate),
      type: studentType,
    };

    const userExists = await this.prisma
      .$queryRaw`SELECT * FROM public."User" u WHERE u."email" = ${newData.email}`;

    console.log('user exists ? ', userExists);

    if (userExists[0]) {
      throw new HttpException(
        `Informações inválidas! E-mail já está em uso.`,
        HttpStatus.CONFLICT,
      );
    }

    const createdUser = await this.prisma.user.create({
      data: {
        ...newData,
        address: {
          create: data.address,
        },
      },
      include: {
        address: true,
      },
    });

    const classExists = await this.prisma.class.findUnique({
      where: {
        id: data.classId,
      },
    });

    if (!classExists) {
      throw new HttpException(
        `Informações inválidas para a turma, não foi possível cadastrar o estudante.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const dataStudent = {
      schoolId: currentSchool.id,
      status: true,
      enrollment: data.enrollment,
      classId: data.classId,
      entryForm: data.entryForm,
      reasonForTransfer: data.reasonForTransfer ? data.reasonForTransfer : null,
      userId: createdUser.id,
    };

    const studentExists = await this.prisma
      .$queryRaw`SELECT * FROM public."Student" s WHERE s."enrollment" = ${dataStudent.enrollment}`;

    console.log(studentExists);

    if (studentExists[0]) {
      throw new HttpException(
        `Informações inválidas! A matrícula já está em uso.`,
        HttpStatus.CONFLICT,
      );
    }

    const createdStudent = await this.prisma.student.create({
      data: {
        ...dataStudent,
      },

      include: {
        class: true,
      },
    });

    const createdSponsor = await this.prisma.sponsor.create({
      data: {
        type: 'sponsor',
        email: newData.email,
        password: password,
        studentId: createdStudent.id,
      },
    });

    const response = {
      ...createdUser,
      ...createdStudent,
      ...createdSponsor,
      password: undefined,
    };

    return {
      data: response,
      status: HttpStatus.CREATED,
      message: 'Estudante cadastrado com sucesso.',
    };
  }

  async update(studentId: string, updateStudentDTO: UpdateStudentDTO) {
    const studentExists = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!studentExists) {
      throw new HttpException(
        'Erro. Estudante não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedStudent = await this.prisma.user.update({
      where: {
        id: studentExists.userId,
      },
      data: updateStudentDTO,
    });

    if (!updatedStudent) {
      throw new HttpException(
        'Erro ao atualizar informações do estudante.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: updatedStudent,
      status: HttpStatus.OK,
      message: 'Dados do estudante atualizado com sucesso.',
    };
  }

  async createManyStudents(
    file: Express.Multer.File,
    schoolId: string,
    classId: string,
  ) {
    const workbook = XLSX.read(file.buffer);
    const data = [];
    const createdStudents: Partial<StudentCreateMany>[] = [];
    const notCreatedStudents: Partial<StudentCreateMany>[] = [];
    const existsStudents: Partial<User>[] = [];

    for (const name of workbook.SheetNames) {
      data.push(...XLSX.utils.sheet_to_json(workbook.Sheets[name]));
    }

    const schoolExists = await this.prisma
      .$queryRaw<School>`select * from public."School" s where s.id = ${schoolId}`;

    const classExists = await this.prisma
      .$queryRaw<Class>`select * from public."Class" c where c.id = ${classId}`;

    if (!schoolExists[0] || !classExists[0]) {
      throw new HttpException(
        `Informações inválidas. Turma ou escola selecionadas não foram encontradas.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const newStudent: Partial<StudentCreateMany> = {};

    for (const student of data) {
      const userExists = await this.prisma
        .$queryRaw`select u.id, u."name", u.email, c."name" as className, sc."name" as school from public."User" u inner join "Student" s on s."userId" = u.id inner join "Class" c on s."classId" = c.id inner join "School" sc on s."schoolId" = sc.id where u.email = ${student.email}`;

      const hashSalt = bcrypt.genSaltSync(Number(process.env.HASH_SALT));
      newStudent.schoolId = schoolId;
      newStudent.classId = classId;
      newStudent.status = true;
      newStudent.enrollment = `${student?.enrollment}`;
      newStudent.entryForm = 'Normal';
      newStudent.name = `${student?.name}`;
      newStudent.email = `${student?.email}`;
      newStudent.phone = `${student?.phone}`;
      newStudent.password = bcrypt.hashSync(String(student.password), hashSalt);
      newStudent.type = 'student';
      newStudent.gender = GenderTransform[student?.gender];
      newStudent.birthDate = new Date(student?.birthDate);
      newStudent.labelAddress = `${student?.labelAddress}`;
      newStudent.city = `${student?.city}`;
      newStudent.number = `${student?.number}`;
      newStudent.area = `${student?.area}`;
      newStudent.uf = `${student?.uf}`;
      newStudent.zipCode = `${student?.zipCode}`;
      newStudent.street = `${student?.street}`;

      if (!userExists[0]) {
        const createdStudent = await this.prisma.student.create({
          data: {
            enrollment: newStudent.enrollment,
            entryForm: newStudent.entryForm,
            status: newStudent.status,
            class: {
              connect: {
                id: newStudent.classId,
              },
            },
            school: {
              connect: {
                id: newStudent.schoolId,
              },
            },
            user: {
              create: {
                name: newStudent.name,
                email: newStudent.email,
                birthDate: newStudent.birthDate,
                gender: newStudent.gender,
                password: newStudent.password,
                phone: newStudent.phone,
                type: newStudent.type,
                address: {
                  create: {
                    labelAddress: newStudent.labelAddress,
                    city: newStudent.city,
                    number: newStudent.number,
                    area: newStudent.area,
                    uf: newStudent.uf,
                    zipCode: newStudent.zipCode,
                    street: newStudent.street,
                  },
                },
              },
            },
          },
        });

        if (!createdStudent) {
          notCreatedStudents.push(newStudent);
        }

        createdStudents.push(newStudent);
      } else {
        existsStudents.push(userExists);
      }
    }

    return {
      total: data.length,
      createdStudents: createdStudents.length,
      existsStudents,
      notCreatedStudents,
    };
  }

  async remove(studentId: string) {
    try {
      const studentExists = await this.prisma.student.findUnique({
        where: {
          id: studentId,
        },
      });

      if (!studentExists) {
        throw new HttpException(
          'Não foi possível remover. Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.student.delete({
        where: {
          id: studentExists.id,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Estudante removido com sucesso.',
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async submitEvaluativeDelivery() {}

  async findBySchool({ schoolId, managerId }: ListEntitiesForSchoolDTO) {
    const currentManager = await this.prisma.manager.findUnique({
      where: {
        userId: managerId,
      },
    });

    if (!currentManager) {
      throw new HttpException(
        'Acesso negado. O gestor não está cadastrado a esta escola.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const students = await this.prisma.student.findMany({
      where: { schoolId },
    });

    if (!students) {
      throw new HttpException(
        'Não existem estudantes cadastrados para essa escola',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return {
      data: students,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }

  async findStudentsBySchool(
    { schoolId, managerId }: ListEntitiesForSchoolDTO,
    paginationDTO: PaginationDTO,
  ) {
    await this.managerService.findCurrentManager({
      schoolId,
      managerId,
    });

    const [page, qtd, skippedItems] = pagination(paginationDTO);

    const studentsCount = await this.prisma.student.count({
      where: {
        school: {
          id: schoolId,
        },
      },
    });

    const students = await this.prisma.student.findMany({
      where: {
        school: {
          id: schoolId,
        },
      },
      include: {
        class: true,
        user: true,
      },
      skip: skippedItems ? skippedItems : undefined,
      take: qtd ? qtd : undefined,
    });

    if (!students) {
      throw new HttpException(
        'Não existem estudantes cadastrados para esta escola.',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const totalCount = studentsCount;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: students,
      totalCount,
      page: page,
      limit: qtd,
      totalPages: totalPages > 0 ? totalPages : 1,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }

  async findStudentsByClass(name: string, classId: string) {
    const students = await this.prisma.student.findMany({
      where: {
        classId,
        user: {
          name: {
            contains: name,
          },
        },
      },
    });

    return {
      data: students,
      status: HttpStatus.OK,
      message: 'Estudantes retornados com sucesso.',
    };
  }

  async findStudentsByClassId(classId: string) {
    const students = await this.prisma.student.findMany({
      where: {
        classId: classId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            birthDate: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
            gender: true,
            type: true,
            avatar: true,
          },
        },
      },
    });

    return {
      data: students,
      status: HttpStatus.OK,
      message: 'Sucess.',
    };
  }

  findByEnrollment(enrollment: string) {
    const student = this.prisma.student.findFirst({
      where: {
        enrollment: enrollment,
      },
      include: {
        user: {
          select: {
            password: true,
          },
        },
      },
    });
    return student;
  }

  async findAllActivities(userId: string, filters) {
    try {
      const studentId = await this.findStudentIdByUserId(userId);

      if (!studentId) {
        throw new HttpException(
          'Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const classId = await this.prisma.student.findFirst({
        where: {
          id: studentId.id,
        },
        select: {
          class: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!classId) {
        throw new HttpException(
          'Classe não encontrada para este estudante.',
          HttpStatus.NOT_FOUND,
        );
      }

      const allActivities = await this.classService.findAllDisciplinesOfClass(
        classId.class.id,
        filters,
      );

      const resultMap = allActivities.disciplines.map((discipline) => {
        return {
          disciplineId: discipline.id,
          name: discipline.name,
          HomeWorks: discipline.homeWorks.map((activities) => {
            return {
              id: activities.id,
              name: activities.name,
              description: activities.description,
              dueDate: activities.dueDate,
              isOpen: activities.isOpen,
              submission: activities.evaluativeDelivery,
              attachement: activities.attachement,
              status: this.checkSubmissionStatus(activities.evaluativeDelivery),
            };
          }),
        };
      });

      return resultMap;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Failed!!!', HttpStatus.BAD_REQUEST);
    }
  }

  checkSubmissionStatus(submission) {
    let activitySub = 'Submetida';
    let activityPed = 'Pendente';

    if (submission[0] != undefined) {
      return activitySub;
    } else {
      return activityPed;
    }
  }

  async findStudentIdByUserId(userId: string) {
    const studentId = await this.prisma.student.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        classId: true,
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return studentId;
  }

  async findClassByStudentId(userId: string) {
    try {
      const studentId = await this.prisma.student.findFirst({
        where: {
          userId: userId,
        },
        select: {
          id: true,
        },
      });

      if (!studentId) {
        throw new HttpException(
          'Erro. Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const classId = await this.prisma.student.findUnique({
        where: {
          id: studentId.id,
        },
        select: {
          classId: true,
        },
      });

      if (!classId) {
        throw new HttpException(
          'Classe não encontrada para este estudante.',
          HttpStatus.NOT_FOUND,
        );
      }

      return classId;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllNotesByPeriod(userId: string) {
    try {
      const studentId = await this.findStudentIdByUserId(userId);

      if (!studentId) {
        throw new HttpException(
          'Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const schoolId = await this.prisma.student.findUnique({
        where: {
          id: studentId.id,
        },
        select: {
          schoolId: true,
        },
      });

      const notesByPeriod = await this.schoolService.findAllPeriod(
        schoolId.schoolId,
      );

      const resultMap = notesByPeriod.Period.map((period) => {
        return {
          name: period.name,
          startOfPeriod: period.startOfPeriod,
          endOfPeriod: period.endOfPeriod,
          disciplineBySchedule: period.schedule.map((disciplineBySchedule) => {
            return {
              name: disciplineBySchedule.discipline.name,
              homeWorks: disciplineBySchedule.discipline.homeWorks.map(
                (homeWork) => {
                  return {
                    name: homeWork.name,
                    description: homeWork.description,
                  };
                },
              ),
            };
          }),
        };
      });

      return notesByPeriod;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async detailOfStudent(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: {
        id: studentId,
      },
      select: {
        id: true,
        enrollment: true,
        status: true,
        entryForm: true,
        reasonForTransfer: true,
        class: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                disciplines: true,
              },
            },
          },
        },
        school: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            avatar: true,
            birthDate: true,
            email: true,
            gender: true,
            phone: true,
          },
        },
      },
    });

    if (!student) {
      throw new HttpException(
        'Erro. Estudante não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedDetailOfStudent = {
      ...student,
      name: student.user.name,
      birthDate: student.user.birthDate,
      email: student.user.email,
      gender: student.user.gender,
      phone: student.user.phone,
      class: student.class.name,
      classId: student.class.id,
      qtdDisciplines: student.class._count.disciplines,
      schoolName: student.school.name,
    };

    delete formattedDetailOfStudent.class;
    delete formattedDetailOfStudent.user;
    delete formattedDetailOfStudent.school;

    return {
      data: formattedDetailOfStudent,
      status: HttpStatus.OK,
      message: 'Aluno retornado com sucesso.',
    };
  }

  async updateClassOfStudent(studentId: string, updateStudentDto) {
    try {
      const { newClassId } = updateStudentDto;

      if (!newClassId) {
        await this.prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            classId: null,
          },
        });
      } else {
        await this.prisma.student.update({
          where: {
            id: studentId,
          },
          data: {
            classId: newClassId,
          },
        });
      }

      return {
        status: HttpStatus.OK,
        message: 'Estudante atualizado com sucesso.',
      };
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllNotesByReportCard(userId: string) {
    try {
      const student = await this.prisma.student.findFirst({
        where: {
          userId,
        },
      });

      if (!student) {
        throw new HttpException(
          'Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const currentYear = new Date().getUTCFullYear();

      const periods = await this.prisma.period.findMany({
        where: {
          schoolId: student.schoolId,
          startOfPeriod: {
            gte: new Date(currentYear, 0, 1),
          },
          endOfPeriod: {
            lte: new Date(currentYear, 11, 31),
          },
        },
      });

      const rates = Promise.all(
        periods.map(async (period) => {
          const data = await this.prisma.$queryRaw<
            ReportCard[]
          >`select d.id as id, d."name" as discipline, AVG(ed.rate) as mean from public."EvaluativeDelivery" ed inner join "HomeWork" hw on ed."homeWorkId" =hw.id inner join "Discipline" d on hw."disciplineId" = d.id where ed."studentId" = ${student.id} and ed."owner" = 'Professor'::"OwnerAction" 
        and ed.stage = 'Avaliada'::"EvaluationStage" and hw."dueDate"
        between ${period.startOfPeriod} and ${period.endOfPeriod}
        group by d.id`;

          const newData = {
            periodId: period.id,
            periodName: period.name,
            startOfPeriod: period.startOfPeriod,
            endOfPeriod: period.endOfPeriod,
            ...data,
          };

          return newData;
        }),
      );

      return {
        data: await rates,
        status: HttpStatus.OK,
        message: 'Médias do estudante retornadas com sucesso.',
      };

      // const allReportCard = await this.prisma.reportCard.findMany({
      //   where: {
      //     studentId: studentId.id,
      //   },
      //   select: {
      //     period: {
      //       select: {
      //         id: true,
      //         name: true,
      //       },
      //     },
      //     homeWork: {
      //       include: {
      //         discipline: true,
      //         evaluativeDelivery: {
      //           where: {
      //             owner: 'teacher',
      //           },
      //           select: {
      //             rate: true,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });

      // if (!allReportCard) {
      //   return {
      //     data: [],
      //     status: HttpStatus.OK,
      //     message: 'Boletim do estudante retornado com sucesso.',
      //   };
      // }

      // const resultMap = await allReportCard.map((period) => {
      //   return {
      //     periodId: period.period.id,
      //     periodName: period.period.name,
      //     disciplineId: period.homeWork.discipline.id,
      //     disciplineName: period.homeWork.discipline.name,
      //     rate: period.homeWork.evaluativeDelivery[0].rate,
      //   };
      // });

      // function groupBy(array, key) {
      //   const arrayReduce = array.reduce(
      //     (acc, item) => ({
      //       ...acc,
      //       [item[key]]: [...(acc[item[key]] ?? []), item],
      //     }),
      //     {},
      //   );

      //   const result = Object.keys(arrayReduce).map(function (key) {
      //     return [key, arrayReduce[key]];
      //   });

      //   return result;
      // }

      // const groupByPeriod = groupBy(resultMap, 'periodId');

      // const data = groupByPeriod.map((valueOfPeriod) => {
      //   const groupByDiscipline = valueOfPeriod.map(
      //     (valueOfDiscipline, index) => {
      //       if (index % 2 !== 0) {
      //         return groupBy(valueOfDiscipline, 'disciplineId');
      //       }
      //     },
      //   );

      //   const formattedData = groupByDiscipline.filter(function (i) {
      //     return i;
      //   });

      //   return formattedData[0];
      // });

      // return data;
      //return groupByPeriod;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllAveragesByStudent(userId) {
    try {
      const studentId = await this.findStudentIdByUserId(userId);

      if (!studentId) {
        throw new HttpException(
          'Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const averagesByDiscipline = await this.prisma.reportAverage.findMany({
        distinct: ['disciplineId'],
        where: {
          studentId: studentId.id,
        },
        select: {
          discipline: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      let listOfMediaGradeByDiscipline = [];

      for (const discipline of averagesByDiscipline) {
        listOfMediaGradeByDiscipline.push({
          disciplineId: discipline.discipline.id,
          discipline: discipline.discipline.name,
          notes: await this.findTheAveragesByDiscipline(
            discipline.discipline.id,
            studentId.id,
          ),
        });
      }

      const averagesByFormattedDiscipline = listOfMediaGradeByDiscipline.map(
        (discipline) => {
          return {
            disciplineId: discipline.disciplineId,
            discipline: discipline.discipline,
            notes: discipline.notes.map((note) => {
              return {
                average: note.rate,
                periodId: note.period.id,
                period: note.period.name,
              };
            }),
          };
        },
      );

      return averagesByFormattedDiscipline;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Failed!!!', HttpStatus.BAD_REQUEST);
    }
  }

  async findAllStudentAverages(userId) {
    try {
      const studentId = await this.findStudentIdByUserId(userId);

      const currentYear = new Date().getUTCFullYear();

      if (!studentId) {
        throw new HttpException(
          'Estudante não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const averagesByDiscipline = await this.prisma.reportAverage.findMany({
        distinct: ['disciplineId'],
        where: {
          studentId: studentId.id,
          period: {
            startOfPeriod: {
              gte: new Date(currentYear, 0, 1),
            },
            endOfPeriod: {
              lte: new Date(currentYear, 11, 31),
            },
          },
        },
        select: {
          discipline: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      let listOfMediaGradeByDiscipline = [];

      for (const discipline of averagesByDiscipline) {
        listOfMediaGradeByDiscipline.push({
          disciplineId: discipline.discipline.id,
          discipline: discipline.discipline.name,
          notes: await this.findTheAveragesByDiscipline(
            discipline.discipline.id,
            studentId.id,
          ),
        });
      }

      let averagesByFormattedDiscipline = [];

      for (const discipline of listOfMediaGradeByDiscipline) {
        averagesByFormattedDiscipline.push({
          disciplineId: discipline.disciplineId,
          discipline: discipline.discipline,
          finalAverage: await this.calculateAverageGradesByPeriod(
            discipline.notes,
          ),
          notes: discipline.notes.map((note) => {
            return {
              average: note.rate,
              periodId: note.period.id,
              period: note.period.name,
            };
          }),
        });
      }

      return averagesByFormattedDiscipline;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Failed!!!', HttpStatus.BAD_REQUEST);
    }
  }

  async calculateAverageGradesByPeriod(notes) {
    let noNote = '-';
    let average = 0;
    let result = 0;

    if (notes.length === 0) {
      return noNote;
    }

    for (let rate of notes) {
      average += rate.rate;
    }

    result = average / notes.length;
    let temp = parseFloat(result.toFixed(1));

    return temp;
  }

  async findTheAveragesByDiscipline(disciplineId, studentId) {
    const currentYear = new Date().getUTCFullYear();

    try {
      const averageByDiscipline = await this.prisma.reportAverage.findMany({
        where: {
          studentId: studentId,
          disciplineId: disciplineId,
          period: {
            startOfPeriod: {
              gte: new Date(currentYear, 0, 1),
            },
            endOfPeriod: {
              lte: new Date(currentYear, 11, 31),
            },
          },
        },
        select: {
          rate: true,
          period: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return averageByDiscipline;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllAverageForStudentsByDisciplineId(disciplineId: string) {
    try {
      const currentYear = new Date().getUTCFullYear();

      const classId = await this.prisma.discipline.findFirst({
        where: {
          id: disciplineId,
        },
        select: {
          classId: true,
        },
      });

      const averageStudents = await this.prisma.student.findMany({
        where: {
          classId: classId.classId,
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
          reportAverage: {
            where: {
              disciplineId: disciplineId,
              period: {
                startOfPeriod: {
                  gte: new Date(currentYear, 0, 1),
                },
                endOfPeriod: {
                  lte: new Date(currentYear, 11, 31),
                },
              },
            },
            select: {
              rate: true,
              periodId: true,
              period: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      let averagesByDiscipline = [];

      for (const student of averageStudents) {
        averagesByDiscipline.push({
          studentId: student.id,
          student: student.user.name,
          avarageFinal: await this.calculateAverageGradesByPeriod(
            student.reportAverage,
          ),
          notes: student.reportAverage.map((average) => {
            return {
              average: average.rate,
              periodId: average.periodId,
              period: average.period.name,
            };
          }),
        });
      }

      return averagesByDiscipline;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findSchoolOfLoggedUser(userId: string) {
    const school = await this.prisma.school.findFirst({
      where: {
        students: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!school) {
      throw new HttpException(
        `Erro. Escola não encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    return school;
  }

  async findAllAbsencesOfStudent(userId: string) {
    try {
      const studentId = await this.findStudentIdByUserId(userId);

      const disciplines = await this.prisma.discipline.findMany({
        where: {
          classId: studentId.classId,
        },
        select: {
          id: true,
          name: true,
          lessons: {
            select: {
              id: true,
              name: true,
              LackOfClass: true,
            },
          },
        },
      });

      const listOfAbsences = [];

      for (const discipline of disciplines) {
        const absencesPerMonth = await this.prisma.$queryRaw<
          AbsenscesPerMonth[]
        >`    SELECT date_trunc('month', to_date(loc."lessonDate", 'YYYY-MM-DD')) as month, count(loc."studentId") as count
        FROM public."LackOfClass" loc inner join "Lesson" l on loc."lessonId" = l.id where loc."studentId" = ${studentId.id} and l."disciplineId" = ${discipline.id}
        GROUP BY 1`;

        listOfAbsences.push({
          disciplineId: discipline.id,
          disciplineName: discipline.name,
          absencesPerMonth: absencesPerMonth.map((absence) => {
            const month = parseInt(absence.month.split('-')[1]);
            const formattedMonth = Months[month];

            const newData = {
              month: formattedMonth,
              count: absence.count ? absence.count : 0,
            };

            return newData;
          }),
        });
      }

      return listOfAbsences;
    } catch (error) {
      if (error) throw error;
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
