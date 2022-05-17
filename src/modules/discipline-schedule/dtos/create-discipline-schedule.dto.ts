import { Day } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDisciplineScheduleDto {
  @IsString()
  @IsNotEmpty()
  day: Day;
  @IsString()
  @IsNotEmpty()
  disciplineId: string;
  @IsDateString()
  @IsNotEmpty()
  initialHour: string;
  @IsDateString()
  @IsNotEmpty()
  finishHour: string;
}
