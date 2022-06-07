import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateLackOfClassDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string[];

  @IsNotEmpty()
  @ApiProperty()
  date: Date;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
