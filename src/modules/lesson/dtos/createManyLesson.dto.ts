import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyLessonDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  lessonId: string;

  @ApiProperty()
  @IsNotEmpty()
  students: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lessonDate: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
