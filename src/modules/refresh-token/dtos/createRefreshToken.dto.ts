import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateRefreshTokenDTO {
  @ApiProperty({
    example: '60f3bdd6-9e7e-47b9-b35e-dd7b7f811357',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
