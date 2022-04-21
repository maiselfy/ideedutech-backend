import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { TeacherController } from './controller/teacher.controller';
import { TeacherService } from './services/teacher.service';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, PrismaService],
})
export class TeacherModule {}
