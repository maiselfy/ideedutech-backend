import { SubmissionService } from './../services/submission.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import CreateSubmissionDTO from '../dtos/createSubmission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDTO) {
    return this.submissionService.create(createSubmissionDTO);
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }
}
