import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateArchivesUploadDTO from '../dtos/createArchivesUpload.dto';
import { ArchivesUploadService } from '../services/archives-upload.service';

@Controller('archives-upload')
export class ArchivesUploadController {
  constructor(private readonly archivesUploadService: ArchivesUploadService) {}

  @Public()
  @Post()
  create(@Body() createArchivesUploadDTO: CreateArchivesUploadDTO) {
    return this.archivesUploadService.uploadImage(createArchivesUploadDTO);
  }

  // @Get()
  // findAll() {
  //   return this.archivesUploadService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.archivesUploadService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateArchivesUploadDto: UpdateArchivesUploadDto,
  // ) {
  //   return this.archivesUploadService.update(+id, updateArchivesUploadDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.archivesUploadService.remove(+id);
  // }
}
