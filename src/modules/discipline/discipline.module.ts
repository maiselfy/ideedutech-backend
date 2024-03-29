import { Module } from '@nestjs/common';
import { DisciplineService } from './service/discipline.service';
import { DisciplineController } from './controller/discipline.controller';
import { PrismaService } from 'src/database/prisma.service';
import { ManagerService } from '../manager/service/manager.service';
import { StudentService } from '../student/services/student.service';
import { ClassService } from '../class/services/class.service';
import { SchoolService } from '../school/service/school.service';
import { PeriodService } from '../period/service/period.service';

@Module({
  controllers: [DisciplineController],
  providers: [
    DisciplineService,
    PrismaService,
    ManagerService,
    StudentService,
    ClassService,
    SchoolService,
    PeriodService,
  ],
})
export class DisciplineModule {}
