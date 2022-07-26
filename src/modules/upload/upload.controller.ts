import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import UploadFileDTO from './dtos/UploadFile.dto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: UploadFileDTO) {
    return this.uploadService.uploadFile(file);
  }
}
