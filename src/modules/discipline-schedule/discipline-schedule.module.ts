import { Module } from '@nestjs/common';
import { DisciplineScheduleService } from './service/discipline-schedule.service';
import { DisciplineScheduleController } from './controller/discipline-schedule.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [DisciplineScheduleController],
  providers: [DisciplineScheduleService, PrismaService],
})
export class DisciplineScheduleModule {}
