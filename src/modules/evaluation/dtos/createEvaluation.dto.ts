import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateEvaluationDTO {
  @IsString()
  @IsNotEmpty()
  testId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsOptional()
  rate: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
