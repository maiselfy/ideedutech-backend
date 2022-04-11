import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateActivityDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  disciplineId: string;

  @IsNotEmpty()
  dueDate: Date;

  @IsNotEmpty()
  isOpen: boolean;

  @IsString()
  @IsOptional()
  attachement: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
