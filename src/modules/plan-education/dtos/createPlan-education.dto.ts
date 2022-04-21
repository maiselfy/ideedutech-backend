import { Period } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export default class CreatePlanEducationDTO {
  @IsNotEmpty()
  @IsString()
  schoolYear: string;

  @IsNotEmpty()
  @IsString()
  disciplineId: string;

  periods: Period[];

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
