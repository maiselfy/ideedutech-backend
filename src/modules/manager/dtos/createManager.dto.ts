import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateManagerDTO {
  @ApiProperty({
    example: true,
  })
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({
    example: '99d44d0f-693b-435a-90a2-508f7c9e6434',
  })
  @IsNotEmpty()
  userId: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
