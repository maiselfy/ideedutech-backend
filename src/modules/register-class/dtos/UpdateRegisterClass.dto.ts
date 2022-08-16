import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeRegisterClass } from '@prisma/client';
export default class UpdateRegisterClassDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subContent?: string;

  @ApiProperty({
    example: 'c0023a7e-f2fd-468e-87df-3b1e0c4780b6',
  })
  @IsString()
  @IsOptional()
  contentId?: string;

  @IsString()
  @IsOptional()
  lessonId?: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
