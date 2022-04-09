import { Module } from '@nestjs/common';

import { ActivityController } from './controller/activity.controller';
import { ActivityService } from './service/activity.service';
import { PrismaService } from '../prisma';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService, PrismaService],
})
export class ActivityModule {}
