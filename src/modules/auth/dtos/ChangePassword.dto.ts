import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDTO {
  @ApiProperty({
    example: 'oldPassword123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({
    example: 'newPassword123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  passwordConfirmation: string;
}
