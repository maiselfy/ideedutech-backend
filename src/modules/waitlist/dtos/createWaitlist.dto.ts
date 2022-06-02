import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export default class CreateWaitlistDTO {
  @ApiProperty({
    example: 'example@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  approved: boolean;

  @ApiProperty({
    example: '6eeb6d55-7c19-43da-be29-e203870e51f1',
  })
  @IsString()
  schoolId: string;

  @ApiProperty({
    example: 'manager',
  })
  @IsString()
  role: Role;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
