import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindLessonsOfTeacherDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  initialDate?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  finalDate?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  disciplineId?: string;
}
