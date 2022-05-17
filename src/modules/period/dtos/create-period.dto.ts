import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePeriodDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsNotEmpty()
  @IsDateString()
  startOfPeriod: string;

  @IsNotEmpty()
  @IsDateString()
  endOfPeriod: string;
}
