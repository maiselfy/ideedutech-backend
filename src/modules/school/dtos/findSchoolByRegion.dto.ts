import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindSchoolByRegionDTO {
  @ApiProperty({
    example: 'Quixadá',
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({
    example: 'CE',
  })
  @IsString()
  @IsOptional()
  uf: string;
}
