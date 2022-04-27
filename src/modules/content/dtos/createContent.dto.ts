import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export default class CreateContentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  subContent: string;

  @IsString()
  periodId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
