import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export default class UploadFileDTO {
  @ApiProperty({
    example: 'file.extension',
  })
  @IsNotEmpty()
  file: Express.Multer.File;
}
