import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class RemoveLackOfClassDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  @ApiProperty()
  lessonDate: string;
}
