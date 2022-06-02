import { ApiProperty } from '@nestjs/swagger';
import { Day } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDisciplineDTO {
  @ApiProperty({
    example: 'Educação Básica',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '01943f80-9474-455a-98be-28a1a0215352',
  })
  @IsString()
  teacherId?: string;

  @ApiProperty({
    example: 'c0558e59-bb91-4626-befc-c78ece02185b',
  })
  @IsString()
  classId?: string;

  @ApiProperty({
    example: 'A importância do estudo básico ',
  })
  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsArray()
  @IsOptional()
  @Type(() => ScheduleData)
  schedules: ScheduleData[];
}

class ScheduleData {
  @IsNotEmpty()
  @IsString()
  day: Day;

  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  initialHour: string;

  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  finishHour: string;
}
