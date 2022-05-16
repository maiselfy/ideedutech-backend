import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequestDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
