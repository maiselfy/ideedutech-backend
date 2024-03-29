import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
