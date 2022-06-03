import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateEvaluationDTO {
  @ApiProperty({
    example: '0ac5b816-3716-4b80-b090-37bed6ba37b2',
  })
  @IsString()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({
    example: '8bc5b816-3716-4b80-b090-37bed6ba37b2',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    example: '10',
  })
  @IsOptional()
  rate: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
