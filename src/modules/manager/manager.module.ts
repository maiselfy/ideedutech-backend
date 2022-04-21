import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { ManagerController } from './controller/manager.controller';
import { ManagerService } from './service/manager.service';

@Module({
  controllers: [ManagerController],
  providers: [ManagerService, PrismaService]
})
export class ManagerModule {}
