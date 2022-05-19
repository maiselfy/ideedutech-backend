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

export default class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Sua senha deve ter pelo menos 6 caracteres (no mínimo 1 letra maiúscula, letras minúsculas, números e caracteres especiais).',
  })
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
  @IsOptional()
  recoverToken: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
