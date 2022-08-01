import { ApiProperty } from '@nestjs/swagger';
import { Day } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  day: Day;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  disciplineId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  periodId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  initialHour: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  finishHour: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
