import { Address, Gender } from '@prisma/client';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class CreateStudentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @IsOptional()
  phone: string;

  address: Address;

  @IsString()
  @IsOptional()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  enrollment: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  entryForm: string;

  @IsString()
  @IsOptional()
  reasonForTransfer?: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
