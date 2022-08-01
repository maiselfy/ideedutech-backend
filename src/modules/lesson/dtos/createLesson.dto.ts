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
  @IsNotEmpty()
  @IsString()
  disciplineId: string;

  @ApiProperty()
  @IsString()
  scheduleId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  LackOfClass: LackOfClass[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  classDate: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
