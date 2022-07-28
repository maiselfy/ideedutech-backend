import { TypeUser } from '@prisma/client';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { PrismaService } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import { PaginationDTO } from 'src/models/PaginationDTO';
import ListEntitiesForSchoolDTO from '../dtos/listEntitiesForSchool.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
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
    const newData = {
      ...user,
      password: await bcrypt.hash(data.password, hashSalt),
      birthDate: new Date(data.birthDate),
      type: studentType,
    };

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

    const createdStudent = await this.prisma.student.create({
      data: {
        ...dataStudent,
      },

      include: {
        class: true,
      },
    });

    const response = {
      ...createdUser,
      ...createdStudent,
      password: undefined,
    };

    return {
      data: response,
      status: HttpStatus.CREATED,
      message: 'Estudante cadastrado com sucesso.',
    };
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

    const totalCount = students.length;
    const totalPages = Math.round(totalCount / qtd);

    return {
      data: students,
      totalCount: totalCount,
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
          'Estudante não encontrado.',
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
}
