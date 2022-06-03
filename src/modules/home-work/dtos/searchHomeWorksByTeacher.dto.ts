import { TypeHomeWork } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class SearchHomeWorksByTeacherDTO {
  @IsOptional()
  startDate: Date;

  @IsOptional()
  endDate: Date;

  @IsString()
  @IsOptional()
  disciplineId: string;

  @IsString()
  @IsOptional()
  classId: string;

  @IsString()
  @IsOptional()
  type: TypeHomeWork;

  @IsOptional()
  isOpen: boolean;
}
