import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import CreateRegisterClassDTO from '../dtos/createRegisterClass.dto';

@Injectable()
export class RegisterClassService {
  constructor(private prisma: PrismaService) {}

  async create(createRegisterClassDTO: CreateRegisterClassDTO) {
    const data = createRegisterClassDTO;

    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: data.lessonId,
      },
    });

    if (!lesson) {
      throw new HttpException(
        'Erro. Aula não encontrada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const period = await this.prisma.period.findUnique({
      where: {
        id: data.periodId,
      },
    });

    if (!period) {
      throw new HttpException(
        'Erro. Período não encontrado.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdRegisterClass = await this.prisma.registerClass.create({
      data,
    });

    if (!createdRegisterClass) {
      throw new HttpException(
        'Não foi possível criar o registro de aula, por favor tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      data: createdRegisterClass,
      status: HttpStatus.CREATED,
      message: 'Registro de aula cadastrado com sucesso',
    };
  }

  async getClassRegistersOfDiscipline(disciplineId: string) {
    const discipline = await this.prisma.discipline.findFirst({
      where: {
        id: disciplineId,
      },
    });

    if (!discipline) {
      throw new HttpException(
        'Erro. Disciplina não encontrada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const classRegisters = await this.prisma.registerClass.findMany({
      where: {
        Lesson: {
          disciplineId,
        },
      },
      select: {
        Content: {
          select: {
            name: true,
            subContent: true,
          },
        },
        Lesson: {
          select: {
            classDate: true,
            notes: true,
          },
        },
      },
    });

    const formattedClassRegisters = classRegisters.map((classRegister) => {
      const newData = {
        content: classRegister.Content.name,
        subContent: classRegister.Content.subContent,
        classDate: classRegister.Lesson.classDate,
        observations: classRegister.Lesson.notes,
      };

      return newData;
    });

    return {
      data: formattedClassRegisters,
      status: HttpStatus.OK,
      message: 'Registros de aula retornados com sucesso.',
    };
  }
}
