import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}
  async create(createActivityDTO) {
    const data = createActivityDTO;
  }
}
