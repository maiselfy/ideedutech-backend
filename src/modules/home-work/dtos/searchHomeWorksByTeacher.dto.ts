import { ApiProperty } from '@nestjs/swagger';
import { TypeHomeWork } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class SearchHomeWorksByTeacherDTO {
  @ApiProperty()
  @IsOptional()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  endDate: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  disciplineId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  classId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  type: TypeHomeWork;

  @IsOptional()
  isOpen: boolean;
}
