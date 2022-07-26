import { Address, Gender } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString }
from 'class-validator';

export default class UpdateUserDTO {
  @ApiProperty({
    example: 'Eliardo Vieira'
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2001-02-22'
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  birthDate: Date;

  @ApiProperty({
    example: '(00) 0 0000-0000'
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: 'male'
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
