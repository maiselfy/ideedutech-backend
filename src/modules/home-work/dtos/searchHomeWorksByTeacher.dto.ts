import { ApiProperty } from '@nestjs/swagger';
import { TypeHomeWork } from '@prisma/client';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

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
  @IsOptional()
  type: TypeHomeWork;

  @IsOptional()
  isOpen: boolean;

  @IsOptional()
  @IsNumberString()
  page: string;

  @IsOptional()
  @IsNumberString()
  qtd: string;

  @IsOptional()
  @IsString()
  orderBy: string;

  @IsOptional()
  sort: 'asc' | 'desc';
}
