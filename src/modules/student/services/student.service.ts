import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ManagerService } from 'src/modules/manager/service/manager.service';
import { PrismaService } from 'src/modules/prisma';
import pagination from 'src/utils/pagination';
import CreateStudentDTO from '../dtos/createStudent.dto';
import ListEntitiesForSchoolDTO from '../dtos/listEntitiesForSchool.dto';

import * as bcrypt from 'bcrypt';
import CreateUserDTO from 'src/modules/user/dtos/createUser.dto';

@Injectable()
export class StudentService {
  constructor(
    private prisma: PrismaService,
    private managerService: ManagerService,
  ) {}

  async create(createStudentDTO) {
    const data = createStudentDTO;

    const userExistsOnWaitlist = await this.prisma.waitList.findUnique({
      where: { value: data.email },
    });

    if (!userExistsOnWaitlist) {
      throw new HttpException(
        `Acesso negado. Informações inválidas`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = {
      name: data.name,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      phone: data.phone,
      address: data.address,
      gender: data.gender,
    };

    const hashSalt = Number(process.env.HASH_SALT);
    const newData = {
      ...user,
      password: await bcrypt.hash(data.password, hashSalt),
      birthDate: new Date(data.birthDate),
      type: userExistsOnWaitlist.role,
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
      schoolId: userExistsOnWaitlist.schoolId,
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

  async findAll() {}

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
    const currentManager = await this.managerService.findCurrentManager({
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
}
