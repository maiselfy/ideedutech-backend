import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TypeRegisterClass } from '@prisma/client';
export default class CreateRegisterClassDTO {
  @ApiProperty({
    example: 'planEducation',
  })
  @IsString()
  @IsNotEmpty()
  type: TypeRegisterClass;

  @ApiProperty({
    example: 'c0023a7e-f2fd-468e-87df-3b1e0c4780b6',
  })
  @IsString()
  @IsOptional()
  contentId: string;

  @ApiProperty({
    example: 'd1123a7e-f2fd-468e-87df-3b1e0c4780b6',
  })
  @IsString()
  @IsOptional()
  periodId: string;

  @ApiProperty({
    example: '73b12ee2-ad73-4419-aefb-ef9fc08643b6',
  })
  @IsString()
  @IsOptional()
  lessonId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
