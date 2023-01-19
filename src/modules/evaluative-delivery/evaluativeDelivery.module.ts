import { PrismaService } from '../../database/prisma.service';
import { Module } from '@nestjs/common';
import { EvaluativeDeliveryService } from './services/evaluativeDelivery.service';
import { EvaluativeDeliveryController } from './controller/evaluativeDelivery.controller';
import { StudentService } from '../student/services/student.service';
import { ManagerService } from '../manager/service/manager.service';
import { ClassService } from '../class/services/class.service';
import { SchoolService } from '../school/service/school.service';
import { PeriodService } from '../period/service/period.service';

@Module({
  controllers: [EvaluativeDeliveryController],
  providers: [
    EvaluativeDeliveryService,
    PrismaService,
    StudentService,
    ManagerService,
    ClassService,
    SchoolService,
    PeriodService,
  ],
})
export class EvaluativeDeliveryModule {}
