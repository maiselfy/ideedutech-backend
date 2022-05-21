import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePeriodDTO {
  @ApiProperty({
    example: '4 semestre',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'b53eb436-cced-49b2-9b84-b5a21e361225',
  })
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty({
    example: '2023-09-15T00:00:00.182Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startOfPeriod: string;

  @ApiProperty({
    example: '2023-11-30T00:00:00.182Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endOfPeriod: string;
}
