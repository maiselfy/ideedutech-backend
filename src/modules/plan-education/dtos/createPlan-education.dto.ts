import { Period } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export default class CreatePlanEducationDTO {
  @IsNotEmpty()
  @IsString()
  schoolYear: string;

  @IsNotEmpty()
  @IsString()
  disciplineId: string;

  @IsArray()
  @Type(() => PeriodData)
  periods: Period[];

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}

class PeriodData {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  startOfPeriod: string;

  @IsNotEmpty()
  @IsString()
  endOfPeriod: string;
}
