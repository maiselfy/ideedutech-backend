import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { ScheduleController } from './controller/schedule.controller';
import { ScheduleService } from './services/schedule.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService, PrismaService],
})
export class ScheduleModule {}
