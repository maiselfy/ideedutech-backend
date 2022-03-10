import { Role } from '@prisma/client';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export default class CreateWaitlistDTO {
  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  approved: boolean;

  @IsString()
  schoolId: string;

  @IsString()
  role: Role;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
