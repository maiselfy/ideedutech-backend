import { LackOfClass } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLessonDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  disciplineId: string;

  @ApiProperty()
  @IsString()
  LackOfClass: LackOfClass[];

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
