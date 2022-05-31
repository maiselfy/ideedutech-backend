import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { SubmissionService } from './../services/submission.service';
import CreateSubmissionDTO from '../dtos/createSubmission.dto';

@ApiTags('Submission')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createSubmissionDTO: CreateSubmissionDTO) {
    return this.submissionService.create(createSubmissionDTO);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.submissionService.findAll();
  }
}
