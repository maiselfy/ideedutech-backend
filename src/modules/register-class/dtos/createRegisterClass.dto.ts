import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateRegisterClassDTO {
  @IsNotEmpty()
  classDate: Date;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  periodId?: string;

  @IsString()
  @IsNotEmpty()
  subContent: string;

  @IsString()
  @IsNotEmpty()
  observation: string;

  @IsString()
  @IsOptional()
  disciplineId?: string;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  updatedAt?: Date;
}
