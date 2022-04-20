import { Module } from '@nestjs/common';
import { DisciplineService } from './service/discipline.service';
import { DisciplineController } from './controller/discipline.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [DisciplineController],
  providers: [DisciplineService, PrismaService],
})
export class DisciplineModule {}
