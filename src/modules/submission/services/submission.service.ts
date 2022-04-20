import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async create() {}

  async findAll() {}
}
