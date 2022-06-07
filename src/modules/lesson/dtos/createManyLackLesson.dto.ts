import { IsNotEmpty } from 'class-validator';
import { CreateLessonDTO } from './createLesson.dto';
import { CreateLackOfClassDTO } from './createLackOfClass.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyLackLessonDTO {
  @ApiProperty()
  @IsNotEmpty()
  createLessonDTO: CreateLessonDTO;

  @IsNotEmpty()
  createLackOfClassDTO: CreateLackOfClassDTO;
}
