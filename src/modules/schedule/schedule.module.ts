import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ScheduleController } from './controller/schedule.controller';
import { ScheduleService } from './services/schedule.service';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService, PrismaService],
})
export class ScheduleModule {}
