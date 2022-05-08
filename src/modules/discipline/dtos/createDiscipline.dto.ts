import { Day } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDisciplineDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  teacherId?: string;

  @IsString()
  classId?: string;

  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsArray()
  @IsOptional()
  @Type(() => ScheduleData)
  schedules: ScheduleData[];
}

class ScheduleData {
  @IsNotEmpty()
  @IsString()
  day: Day;

  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  initialHour: string;

  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  finishHour: string;
}
