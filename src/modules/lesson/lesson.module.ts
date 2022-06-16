import { Module } from '@nestjs/common';
import { LessonController } from './controller/lesson.controller';
import { LessonService } from './services/lesson.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
