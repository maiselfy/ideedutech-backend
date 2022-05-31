import { ApiProperty } from '@nestjs/swagger';
import { Day } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDisciplineScheduleDTO {
  @ApiProperty({
    example: 'friday',
  })
  @IsString()
  @IsNotEmpty()
  day: Day;

  @ApiProperty({
    example: '03952d9c-1d72-4b32-b2b2-a54c80079779',
  })
  @IsString()
  @IsNotEmpty()
  disciplineId: string;

  @ApiProperty({
    example: '2022-04-13T14:14:25.182Z',
  })
  @IsDateString()
  @IsNotEmpty()
  initialHour: string;

  @ApiProperty({
    example: '2022-04-28T14:14:25.182Z',
  })
  @IsDateString()
  @IsNotEmpty()
  finishHour: string;
}
