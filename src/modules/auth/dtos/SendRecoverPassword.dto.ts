import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendRecoverPasswordDTO {
  @ApiProperty({
    example: 'eliardovieira@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
