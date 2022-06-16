import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export default class CreateRegisterClassDTO {
  @ApiProperty({
    example: '2022-03-30T00:00:00.182Z',
  })
  @IsNotEmpty()
  classDate: Date;

  @ApiProperty({
    example: 'planEducation',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

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

  @IsString()
  @IsNotEmpty()
  subContent: string;

  @ApiProperty({
    example: 'Essa aula foi demais',
  })
  @IsString()
  @IsNotEmpty()
  observation: string;

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
