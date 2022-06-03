import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import CreateEvaluativeDeliveryDTO from '../dtos/evaluativeDelivery.dto';

@Injectable()
export class EvaluativeDeliveryService {
  constructor(private prisma: PrismaService) {}

  async create(createEvaluativeDeliveryDTO: CreateEvaluativeDeliveryDTO) {
    const data = createEvaluativeDeliveryDTO;

    console.log(data);

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
