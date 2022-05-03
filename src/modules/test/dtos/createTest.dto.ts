import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateTestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  disciplineId: string;

  @IsString()
  studentId: string;

  @IsNotEmpty()
  rate: number;

  @IsOptional()
  weight: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
