import { IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class ListEntitiesForSchoolDTO {
  @IsString()
  @IsNotEmpty()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  managerId: string;
}
