import { Gender } from '@prisma/client';
import { IsEmail, IsEmpty, IsOptional, IsString } from 'class-validator';

export default class UpdateStudentDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  gender?: Gender;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
