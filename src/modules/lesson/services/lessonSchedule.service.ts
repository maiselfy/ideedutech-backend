import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { format, parseISO } from 'date-fns';
import { PrismaService } from 'src/database/prisma.service';
import { LessonService } from './lesson.service';

@Injectable()
export class LessonSchedulerService {
  constructor(
    private prisma: PrismaService,
    private lessonService: LessonService,
  ) {}
}
