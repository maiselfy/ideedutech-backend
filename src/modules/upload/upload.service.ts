import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { S3Service } from '../../utils/bucket-s3';
@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}
  async uploadFile(file) {
    const s3Service = new S3Service();

    try {
      const uploadSaved = await s3Service.uploadFile(file);

      if (!uploadSaved) {
        throw new Error('File upload in bucker failed');
      }

      const { Location: url } = uploadSaved;

      return {
        url: url,
        status: HttpStatus.OK,
        message: 'Upload realizado com sucesso.',
      };
    } catch (e) {
      console.log(e);
      throw new Error('Upload file failure');
    }
  }
}
