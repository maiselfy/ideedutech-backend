import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { ManagerService } from '../manager/service/manager.service';
import { ClassService } from './services/class.service';
import { ClassController } from './controller/class.controller';

@Module({
  controllers: [ClassController],
  providers: [ClassService, PrismaService, ManagerService],
})
export class ClassModule {}
