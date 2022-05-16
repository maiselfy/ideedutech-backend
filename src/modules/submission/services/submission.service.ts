import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async create(createSubmissionDTO) {
    const data = createSubmissionDTO;

    const createdSubmission = await this.prisma.submission.create({
      data: {
        ...data,
      },
    });

    return {
      data: createdSubmission,
      status: HttpStatus.CREATED,
      message: 'Submission Created',
    };
  }

  async findAll() {
    return this.prisma.submission.findMany();
  }
}
