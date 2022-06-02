import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';

@Injectable()
export class EvaluativeDeliveryService {
  constructor(private prisma: PrismaService) {}

  async create(createEvaluativeDeliveryDTO) {
    const data = createEvaluativeDeliveryDTO;

    const createdEvaluativeDelivery =
      await this.prisma.evaluativeDelivery.create({
        data: {
          ...data,
        },
      });

    return {
      data: createdEvaluativeDelivery,
      status: HttpStatus.CREATED,
      message: 'Evaluative Delivery Created',
    };
  }

  async findAll() {
    return this.prisma.evaluativeDelivery.findMany();
  }
}
