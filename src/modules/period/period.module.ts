import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PeriodController } from './controller/period.controller';
import { PeriodService } from './service/period.service';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService, PrismaService],
})
export class PeriodModule {}
