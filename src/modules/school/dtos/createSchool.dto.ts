import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class CreateSchoolDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  inep?: string;

  @IsString()
  email?: string;

  @IsString()
  @IsOptional()
  addressId: string;

  @IsString()
  @IsOptional()
  cnpj: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
