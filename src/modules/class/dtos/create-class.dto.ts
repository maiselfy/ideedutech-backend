import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClassDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsArray()
  @IsOptional()
  students: { id: string }[];
}
