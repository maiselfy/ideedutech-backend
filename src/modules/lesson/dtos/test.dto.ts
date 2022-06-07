import { LackOfClass } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateLessonDTO } from './createLesson.dto';
import { CreateLackOfClassDTO } from './createLackOfClass.dto';

export class TestDTO {
  createLessonDTO: CreateLessonDTO;

  createLackOfClassDTO: CreateLackOfClassDTO;
}
