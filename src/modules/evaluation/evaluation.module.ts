import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { EvaluationController } from './controller/evaluation.controller';
import { EvaluationService } from './services/evaluation.service';

@Module({
  controllers: [EvaluationController],
  providers: [EvaluationService, PrismaService],
})
export class EvaluationModule {}
