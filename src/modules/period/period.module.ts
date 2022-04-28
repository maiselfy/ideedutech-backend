import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { PeriodController } from './period.controller';
import { PeriodService } from './period.service';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService, PrismaService],
})
export class PeriodModule {}
