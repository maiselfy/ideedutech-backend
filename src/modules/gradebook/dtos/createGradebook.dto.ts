import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGradebookDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  disciplineId: string;

  @ApiProperty()
  @IsNotEmpty()
  numberOfTerm: number;

  @ApiProperty()
  @IsNotEmpty()
  grades: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  schoolTerm: string;

  @ApiProperty()
  @IsNotEmpty()
  mean: number;

  @ApiProperty()
  @IsOptional()
  approved: boolean;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
