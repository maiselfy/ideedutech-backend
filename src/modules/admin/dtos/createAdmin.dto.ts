import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export default class CreateAdminDTO {
  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({
    example: '5311eff5-731a-4154-9f1f-7e76f6df9596',
  })
  @IsNotEmpty()
  userId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
