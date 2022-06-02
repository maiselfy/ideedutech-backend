import { EvaluationStage, OwnerAction } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class EvaluateStudentDeliveryDTO {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  homeWorkId: string;

  @IsNotEmpty()
  rate: number;

  @IsString()
  @IsOptional()
  attachement: string;

  @IsString()
  @IsNotEmpty()
  owner: OwnerAction;

  @IsString()
  @IsNotEmpty()
  stage: EvaluationStage;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
