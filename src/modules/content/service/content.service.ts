import { PrismaService } from 'src/modules/prisma';
import { Injectable, HttpStatus } from '@nestjs/common';
import CreateContentDTO from '../dtos/createContent.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}
  async create(createContentDTO: CreateContentDTO) {
    const data = createContentDTO;

    console.log('DATA CONTENT: ', data);

    const createdContent = await this.prisma.content.create({
      data: {
        ...data,
      },
    });

    return {
      data: createdContent,
      status: HttpStatus.CREATED,
      message: 'Content Created',
    };
  }

  async findAll() {}
}
