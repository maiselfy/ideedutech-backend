import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDTO {
  @ApiProperty({
    example: 'example@gmail.com or 0442211',
  })
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    example: 'Example123',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
