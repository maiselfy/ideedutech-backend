import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { PlanEducationController } from './controller/plan-education.controller';
import { PlanEducationService } from './services/plan-education.service';

@Module({
  controllers: [PlanEducationController],
  providers: [PlanEducationService, PrismaService],
})
export class PlanEducationModule {}
