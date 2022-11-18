import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export default class CreateAddressDTO {
  @ApiProperty({
    example: 'Minha casa',
  })
  @IsString()
  @IsOptional()
  labelAddress?: string;

  @ApiProperty({
    example: 'Rua Maria Francelina Pinheiro Landim',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: 'Solonópole',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: '928',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    example: 'Brasil',
  })
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiProperty({
    example: 'CE',
  })
  @IsString()
  @IsNotEmpty()
  uf: string;

  @ApiProperty({
    example: '63620000',
  })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
