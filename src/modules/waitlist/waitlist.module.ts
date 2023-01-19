import { Module } from '@nestjs/common';
import { ManagerService } from '../manager/service/manager.service';
import { PrismaService } from 'src/database/prisma.service';
import { WaitlistController } from './controller/waitlist.controller';
import { WaitlistService } from './service/waitlist.service';

@Module({
  controllers: [WaitlistController],
  providers: [WaitlistService, PrismaService, ManagerService],
})
export class WaitlistModule {}
