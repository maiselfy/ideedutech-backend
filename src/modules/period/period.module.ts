import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService,PrismaService]
})
export class PeriodModule {}
