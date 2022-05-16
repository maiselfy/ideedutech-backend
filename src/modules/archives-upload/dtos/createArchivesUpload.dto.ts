import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export default class CreateArchivesUploadDTO {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;

  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @IsEmpty()
  createdAt: Date;

  @IsEmpty()
  updatedAt: Date;
}
