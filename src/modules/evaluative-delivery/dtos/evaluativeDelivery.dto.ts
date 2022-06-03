import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EvaluationStage, OwnerAction } from '@prisma/client';
export default class CreateEvaluativeDeliveryDTO {
  @ApiProperty({
    example: '0ac5b816-3716-4b80-b090-37bed6ba37b2',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    example: 'f594ae5d-e233-4478-b55c-04c534f26dae',
  })
  @IsString()
  @IsNotEmpty()
  homeWorkId: string;

  @ApiProperty({
    example: 0,
  })
  @IsOptional()
  rate: number;

  @ApiProperty({
    example: '2022-04-25T11:54:43.892Z',
  })
  @IsOptional()
  duaDate: Date;

  @ApiProperty({
    example: 'atv-431422.pdf',
  })
  @IsString()
  @IsOptional()
  attachement: string;

  @ApiProperty({
    example: 'pending',
  })
  @IsString()
  @IsOptional()
  stage: EvaluationStage;

  @IsNotEmpty()
  owner: OwnerAction;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
