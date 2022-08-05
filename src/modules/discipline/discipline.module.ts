import { Module } from '@nestjs/common';
import { DisciplineService } from './service/discipline.service';
import { DisciplineController } from './controller/discipline.controller';
import { PrismaService } from '../prisma';
import { ManagerService } from '../manager/service/manager.service';
import { StudentService } from '../student/services/student.service';
import { ClassService } from '../class/services/class.service';
import { SchoolService } from '../school/service/school.service';

@Module({
  controllers: [DisciplineController],
  providers: [
    DisciplineService,
    PrismaService,
    ManagerService,
    StudentService,
    ClassService,
    SchoolService,
  ],
})
export class DisciplineModule {}
