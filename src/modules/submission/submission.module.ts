import { PrismaService } from './../prisma/prisma.service';
import { SubmissionService } from './services/submission.service';
import { SubmissionController } from './controller/submission.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService, PrismaService],
})
export class SubmissionModule {}
