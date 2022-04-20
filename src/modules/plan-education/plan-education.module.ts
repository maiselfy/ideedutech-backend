import { Module } from '@nestjs/common';
import { PlanEducationController } from './controller/plan-education.controller';
import { PlanEducationService } from './services/plan-education.service';

@Module({
  controllers: [PlanEducationController],
  providers: [PlanEducationService],
})
export class PlanEducationModule {}
