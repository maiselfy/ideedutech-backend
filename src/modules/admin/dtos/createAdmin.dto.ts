import { IsEmpty, IsNotEmpty } from "class-validator";

export default class CreateAdminDTO {
  @IsNotEmpty()
  status: boolean;

  @IsNotEmpty()
  userId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
