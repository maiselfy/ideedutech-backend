import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { WaitlistController } from './controller/waitlist.controller';
import { WaitlistService } from './service/waitlist.service';

@Module({
  controllers: [WaitlistController],
  providers: [WaitlistService, PrismaService]
})
export class WaitlistModule {}
