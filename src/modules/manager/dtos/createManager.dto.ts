import { IsEmpty, IsNotEmpty } from "class-validator";

export class CreateManagerDTO{
  @IsNotEmpty()
  status: boolean;

  @IsNotEmpty()
  userId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
