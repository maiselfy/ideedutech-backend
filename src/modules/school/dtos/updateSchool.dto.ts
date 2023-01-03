import { ApiProperty } from '@nestjs/swagger';
import { Address } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSchoolDTO {
  @ApiProperty({
    example: 'EEFM Educacional Municipal',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'XX. XXX. XXX/0001-XX.',
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @ApiProperty({
    example: '(88) 9 99999999',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'educacional@gmail.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: '13082175',
  })
  @IsOptional()
  @IsString()
  inep?: string;

  @ApiProperty({
    example: 'example.png',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString()
  @IsOptional()
  addressId: string;

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
