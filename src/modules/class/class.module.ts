import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { PrismaService } from '../prisma';
import { ClassScheduleService } from '../class-schedule/class-schedule.service';
import { ClassScheduleModule } from '../class-schedule/class-schedule.module';

@Module({
  imports: [ClassScheduleModule],
  controllers: [ClassController],
  providers: [ClassService, PrismaService],
})
export class ClassModule {}
