import { IsEmpty, IsNotEmpty } from 'class-validator';

export default class CreatePlanEducationDTO {
  @IsNotEmpty()
  status: boolean;

  @IsNotEmpty()
  userId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
