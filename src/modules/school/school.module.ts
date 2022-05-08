import { Module } from '@nestjs/common';
import { SchoolController } from './controller/school.controller';
import { SchoolService } from './service/school.service';
import { PrismaService } from '../prisma';
import { ManagerService } from '../manager/service/manager.service';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, PrismaService, ManagerService],
})
export class SchoolModule {}
