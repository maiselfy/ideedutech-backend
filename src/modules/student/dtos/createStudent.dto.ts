import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateStudentDTO {
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  status: boolean;

  @IsString()
  @IsNotEmpty()
  enrrollment: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  entryForm: string;

  @IsString()
  @IsOptional()
  reasonForTransfer?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
