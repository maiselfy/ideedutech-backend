import { TypeHomeWork } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateTestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  disciplineId: string;

  @IsOptional()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
  type: TypeHomeWork;

  @IsOptional()
  weight: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
