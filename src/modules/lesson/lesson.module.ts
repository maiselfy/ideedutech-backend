import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { LessonController } from './controller/lesson.controller';
import { LackOfClassService } from './services/lackOfClass.service';
import { LessonService } from './services/lesson.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, PrismaService, LackOfClassService],
})
export class LessonModule {}
