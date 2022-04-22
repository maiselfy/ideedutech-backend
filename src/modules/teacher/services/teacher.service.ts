import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { CreateTeacherDTO } from '../dtos/createTeacher.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  // async create(createTeacherDTO: CreateTeacherDTO) {
  //   const data = createTeacherDTO;

  //   const createdTeacher = await this.prisma.teacher.create({
  //     data,
  //   });

  //   return {
  //     data: createdTeacher,
  //     status: HttpStatus.CREATED,
  //     message: 'Professor cadastrado com sucesso.',
  //   };
  // }
  async findAllTeachersOnSchool(schoolId: string, userId: string) {
    try {
      const findSchool = await this.prisma.school.findFirst({
        where: { managers: { every: { id: { equals: userId } } } },
      });

      if (!findSchool) {
        throw new HttpException('School not found', HttpStatus.BAD_GATEWAY);
      }

      const response = await this.prisma.teacher.findMany({
        select: { user: true },
        where: { schools: { every: { id: schoolId } } },
      });

      return {
        data: response,
        status: HttpStatus.OK,
        message: 'Professores da Escola Listadas com Sucesso',
      };
    } catch (error) {
      if (error) return error;
      return new HttpException(
        'Fail to list teachers from this school',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  async findAll() {
    const teachers = await this.prisma.teacher.findMany();

    if (!teachers) {
      throw new HttpException(
        'Não existem professores registrados em nossa base de dados.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: teachers,
      status: HttpStatus.OK,
      message: 'Professores retornados com sucesso.',
    };
  }

  async findBySchool(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: { teachers: true },
    });

    if (!school) {
      throw new HttpException(
        'Não existe uma instituição com essas credenciais.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: school.teachers,
      status: HttpStatus.OK,
      message: `Professores da instituição ${school.name} retornados com sucesso.`,
    };
  }

  async findById(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Não existem professores registrados nesta instituição.',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      data: teacher,
      status: HttpStatus.OK,
      message: `Professor retornado com sucesso.`,
    };
  }

  // update(id: number, updateTeacherDto: UpdateTeacherDto) {
  //   return `This action updates a #${id} teacher`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} teacher`;
  // }
}
