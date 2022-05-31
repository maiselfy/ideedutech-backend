import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClassDTO {
  @ApiProperty({
    example: '8 ANO F',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'b53eb436-cced-49b2-9b84-b5a21e361225',
  })
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @ApiProperty({
    example: [
      'a53eb436-cced-49b2-9b84-b5a21e361225',
      'b53eb436-cced-49b2-9b84-b5a21e361225',
      'c53eb436-cced-49b2-9b84-b5a21e361225',
      'd53eb436-cced-49b2-9b84-b5a21e361225',
    ],
  })
  @IsArray()
  @IsOptional()
  students: { id: string }[];
}
