import { Module } from '@nestjs/common';

import { HomeWorkController } from './controller/homeWork.controller';
import { HomeWorkService } from './service/homeWorkService.service';
import { PrismaService } from '../prisma';

@Module({
  controllers: [HomeWorkController],
  providers: [HomeWorkService, PrismaService],
})
export class HomeWorkModule {}
