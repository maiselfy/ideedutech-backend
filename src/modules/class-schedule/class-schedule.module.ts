import { Module } from '@nestjs/common';
import { ClassScheduleService } from './class-schedule.service';
import { ClassScheduleController } from './class-schedule.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [ClassScheduleController],
  providers: [ClassScheduleService, PrismaService, ClassScheduleService],
  exports: [ClassScheduleService],
})
export class ClassScheduleModule {}
