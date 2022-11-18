import { Address, Gender } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'Eliardo Vieira',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'eliardovieira@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Admin1234',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '2001-02-22',
  })
  @IsString()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    example: '(00) 0 0000-0000',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: 'male',
  })
  @IsString()
  @IsOptional()
  gender: Gender;

  @ApiProperty({
    example: {
      Rua: 'Rua Maria Francelina Pinheiro Landim',
      city: 'Solonópole',
      number: '928',
      zipCode: '63620000',
      area: 'Brasil',
      uf: 'CE',
      labelAddress: 'Minha Casa',
    },
  })
  @IsOptional()
  address: Address;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
