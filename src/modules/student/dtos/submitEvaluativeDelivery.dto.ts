import { EvaluationStage, OwnerAction } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class SubmitEvaluativeDeliveryDTO {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  homeWorkId: string;

  @IsOptional()
  dueDate: Date;

  @IsString()
  @IsNotEmpty()
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
