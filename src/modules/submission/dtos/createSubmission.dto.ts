import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateSubmissionDTO {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  homeWorkId: string;

  @IsOptional()
  rating: number;

  @IsNotEmpty()
  duaDate: Date;

  @IsString()
  @IsOptional()
  attachement: string;

  @IsString()
  @IsOptional()
  stage: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
