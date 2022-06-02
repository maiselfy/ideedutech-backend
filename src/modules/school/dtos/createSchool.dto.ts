import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSchoolDTO {
  @ApiProperty({
    example: 'EEFM Educacional Municipal',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '(88) 9 99999999',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '13082175',
  })
  @IsOptional()
  @IsString()
  inep?: string;

  @ApiProperty({
    example: 'educacional@gmail.com',
  })
  @IsString()
  email?: string;

  @IsString()
  @IsOptional()
  addressId: string;

  @ApiProperty({
    example: 'XX. XXX. XXX/0001-XX.',
  })
  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
