import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export default class CreateContentDTO {
  @ApiProperty({
    example: 'Ensino Religioso',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'CAPÍTULO 07. Um mundo de igualdade.',
  })
  @IsString()
  @IsNotEmpty()
  subContent: string;

  @ApiProperty({
    example: 'c0023a7e-f2fd-468e-87df-3b1e0c4780b6',
  })
  @IsOptional()
  @IsString()
  periodId?: string;

  @ApiProperty({
    example: '03952d9c-1d72-4b32-b2b2-a54c80079779',
  })
  @IsString()
  disciplineId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
