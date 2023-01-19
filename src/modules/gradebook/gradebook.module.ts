import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GradebookController } from './controller/gradebook.controller';
import { GradebookService } from './services/gradebook.service';

@Module({
  controllers: [GradebookController],
  providers: [GradebookService, PrismaService],
})
export class GradebookModule {}
