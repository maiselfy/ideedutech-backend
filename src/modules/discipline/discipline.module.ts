import { Module } from '@nestjs/common';
import { DisciplineService } from './service/discipline.service';
import { DisciplineController } from './controller/discipline.controller';
import { PrismaService } from '../prisma';
import { ManagerService } from '../manager/service/manager.service';

@Module({
  controllers: [DisciplineController],
  providers: [DisciplineService, PrismaService, ManagerService],
})
export class DisciplineModule {}
