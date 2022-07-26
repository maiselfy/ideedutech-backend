import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateLessonDTO } from './createLesson.dto';
import { CreateLackOfClassDTO } from './createLackOfClass.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyLackLessonDTO {
  @ApiProperty()
  @IsOptional()
  createLessonDTO: CreateLessonDTO;

  @ApiProperty()
  @IsNotEmpty()
  createLackOfClassDTO: CreateLackOfClassDTO;
}
