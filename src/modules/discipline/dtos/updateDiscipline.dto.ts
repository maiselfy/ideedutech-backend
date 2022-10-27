import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDisciplineDTO {
  @ApiProperty({
    example: 'Educação Básica',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '01943f80-9474-455a-98be-28a1a0215352',
  })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({
    example: 'A importância do estudo básico ',
  })
  @IsOptional()
  @IsString()
  topic?: string;
}
