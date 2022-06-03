import { Module } from '@nestjs/common';

import { HomeWorkController } from './controller/homeWork.controller';
import { PrismaService } from '../prisma';
import { HomeWorkService } from './service/homeWork.service';

@Module({
  controllers: [HomeWorkController],
  providers: [HomeWorkService, PrismaService],
})
export class HomeWorkModule {}
