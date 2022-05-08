import { Module } from '@nestjs/common';
import { ManagerService } from '../manager/service/manager.service';
import { PrismaService } from '../prisma';
import { TeacherController } from './controller/teacher.controller';
import { TeacherService } from './services/teacher.service';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService, ManagerService],
})
export class TeacherModule {}
