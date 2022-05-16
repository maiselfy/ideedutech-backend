import { Module } from '@nestjs/common';
import { ArchivesUploadController } from './controller/archives-upload.controller';
import { ArchivesUploadService } from './services/archives-upload.service';

@Module({
  controllers: [ArchivesUploadController],
  providers: [ArchivesUploadService],
})
export class ArchivesUploadModule {}
