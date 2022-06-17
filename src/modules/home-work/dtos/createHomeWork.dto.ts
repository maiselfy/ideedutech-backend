import { TypeHomeWork } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateHomeWorkDTO {
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
  startDate: Date;

  @IsOptional()
  dueDate: Date;

  @IsOptional()
  isOpen: boolean;

  @IsString()
  @IsOptional()
  attachement: string;

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
