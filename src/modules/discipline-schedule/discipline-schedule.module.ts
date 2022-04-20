import { Module } from '@nestjs/common';
import { DisciplineScheduleService } from './discipline-schedule.service';
import { DisciplineScheduleController } from './discipline-schedule.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [DisciplineScheduleController],
  providers: [DisciplineScheduleService, PrismaService],
})
export class DisciplineScheduleModule {}
