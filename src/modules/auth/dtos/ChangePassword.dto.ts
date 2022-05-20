import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  passwordConfirmation: string;
}
