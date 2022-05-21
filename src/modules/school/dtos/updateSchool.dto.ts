import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSchoolDTO {
  @ApiProperty({
    example: 'EEM Educacional Estadual',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '(00) 8 99999999',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '31082175',
  })
  @IsOptional()
  @IsString()
  inep?: string;

  @ApiProperty({
    example: 'educacionalEstadual@gmail.com',
  })
  @IsString()
  email?: string;

  @IsString()
  @IsOptional()
  addressId: string;

  @ApiProperty({
    example: 'XX. XXX. XXX/0002-XX.',
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
