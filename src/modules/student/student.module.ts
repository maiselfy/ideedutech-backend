import { PrismaService } from 'src/modules/prisma';
import { StudentService } from './services/student.service';
import { StudentController } from './controller/student.controller';
import { Module } from '@nestjs/common';
import { ManagerService } from '../manager/service/manager.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaService, ManagerService],
})
export class StudentModule {}
