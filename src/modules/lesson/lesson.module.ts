import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { LessonController } from './controller/lesson.controller';
import { LessonService } from './services/lesson.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, PrismaService],
})
export class LessonModule {}
