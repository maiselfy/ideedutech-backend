import { Module } from '@nestjs/common';
import { EvaluationController } from './controller/evaluation.controller';
import { EvaluationService } from './services/evaluation.service';

@Module({
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
