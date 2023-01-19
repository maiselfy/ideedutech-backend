import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ManagerController } from './controller/manager.controller';
import { ManagerService } from './service/manager.service';

@Module({
  controllers: [ManagerController],
  providers: [ManagerService, PrismaService],
})
export class ManagerModule {}
