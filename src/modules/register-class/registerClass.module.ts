import { PrismaService } from 'src/database/prisma.service';
import { RegisterClassService } from './service/registerClassService.service';
import { RegisterClassController } from './controller/registerClass.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [RegisterClassController],
  providers: [RegisterClassService, PrismaService],
})
export class RegisterClassModule {}
