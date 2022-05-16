import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateArchivesUploadDTO from '../dtos/createArchivesUpload.dto';
import { v4 } from 'uuid';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { MulterModule } from '@nestjs/platform-express';

const S3 = new AWS.S3();
const multer = new MulterModule();

@Injectable()
export class ArchivesUploadService {
  async uploadImage(createArchivesUploadDTO: CreateArchivesUploadDTO) {
    try {
      const { fileName, filePath, mimeType } = createArchivesUploadDTO;
      const fileContent = fs.readFileSync(filePath);
      const fileNameUUID = `file-${v4()}`;

      const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileNameUUID,
        Body: fileContent,
        ACL: 'public-read',
      };

      return new Promise((resolve, reject) => {
        S3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
          if (err) {
            reject(err.message);
            throw new HttpException(
              `Erro ao enviar arquivo para AWS.`,
              HttpStatus.BAD_REQUEST,
            );
          }

          delete data.Bucket;
          delete data.ETag;
          delete data.Location;

          const dataS3 = {
            ...data,
            fileName,
          };

          resolve(dataS3);
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  // findAll() {
  //   return `This action returns all archivesUpload`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} archivesUpload`;
  // }

  // update(id: number, updateArchivesUploadDto: UpdateArchivesUploadDto) {
  //   return `This action updates a #${id} archivesUpload`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} archivesUpload`;
  // }
}
