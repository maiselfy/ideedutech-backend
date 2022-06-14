import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Address)
  address: any;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}

class Address {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsNotEmpty()
  uf: string;

  @IsString()
  @IsNotEmpty()
  labelAddress: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
