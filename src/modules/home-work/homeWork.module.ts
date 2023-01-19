import { Module } from '@nestjs/common';

import { HomeWorkController } from './controller/homeWork.controller';
import { PrismaService } from 'src/database/prisma.service';
import { HomeWorkService } from './service/homeWork.service';
import { StudentService } from '../student/services/student.service';
import { ManagerService } from '../manager/service/manager.service';
import { ClassService } from '../class/services/class.service';
import { SchoolService } from '../school/service/school.service';
import { PeriodService } from '../period/service/period.service';

@Module({
  controllers: [HomeWorkController],
  providers: [
    HomeWorkService,
    PrismaService,
    StudentService,
    ManagerService,
    ClassService,
    SchoolService,
    PeriodService,
  ],
})
export class HomeWorkModule {}
