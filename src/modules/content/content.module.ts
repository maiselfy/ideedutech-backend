import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ContentController } from './controller/content.controller';
import { ContentService } from './service/content.service';

@Module({
  controllers: [ContentController],
  providers: [ContentService, PrismaService],
})
export class ContentModule {}
