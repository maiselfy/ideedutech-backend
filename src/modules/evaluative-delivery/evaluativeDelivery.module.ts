import { PrismaService } from '../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { EvaluativeDeliveryService } from './services/evaluativeDelivery.service';
import { EvaluativeDeliveryController } from './controller/evaluativeDelivery.controller';

@Module({
  controllers: [EvaluativeDeliveryController],
  providers: [EvaluativeDeliveryService, PrismaService],
})
export class EvaluativeDeliveryModule {}
