import { ApiProperty } from '@nestjs/swagger';
import { TypeHomeWork } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateTestDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  disciplineId: string;

  @ApiProperty()
  @IsOptional()
  dueDate: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: TypeHomeWork;

  @ApiProperty()
  @IsOptional()
  weight: number;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
