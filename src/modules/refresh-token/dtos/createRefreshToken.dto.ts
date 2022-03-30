import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export default class CreateRefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
