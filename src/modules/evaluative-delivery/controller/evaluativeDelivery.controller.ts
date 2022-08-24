import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { EvaluativeDeliveryService } from '../services/evaluativeDelivery.service';
import CreateEvaluativeDeliveryDTO from '../dtos/evaluativeDelivery.dto';
import SubmissionOfStudentDTO from '../dtos/submissionOfStudent.dto';
import { User } from 'src/modules/user/decorators/user.decorator';

@ApiTags('EvaluativeDelivery')
@Controller('evaluative-delivery')
export class EvaluativeDeliveryController {
  constructor(
    private readonly evaluationDeliveryService: EvaluativeDeliveryService,
  ) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createEvaluativeDeliveryDTO: CreateEvaluativeDeliveryDTO) {
    return this.evaluationDeliveryService.createForTeacher(
      createEvaluativeDeliveryDTO,
    );
  }

  @ApiBearerAuth()
  @Post('submission')
  createSubmisison(@Body() submissionOfStudentDTO: SubmissionOfStudentDTO) {
    return this.evaluationDeliveryService.createForStudent(
      submissionOfStudentDTO,
    );
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.evaluationDeliveryService.findAll();
  }

  @ApiBearerAuth()
  @Get('submission/:studentId')
  findAllSubmissionFromDisciplinesOfStudent(
    @Param('studentId') studentId: string,
    @Query()
    filters?: { disciplineId?: string; type?: string; createdAt?: string },
  ) {
    return this.evaluationDeliveryService.findAllSubmissionOfStudent(
      studentId,
      filters,
    );
  }

  @ApiBearerAuth()
  @Get('/student/submissions/:homeWorkId')
  findAllStudentSubmissionsByHomeWorkId(
    @User() user,
    @Param('homeWorkId') homeWorkId: string,
  ) {
    return this.evaluationDeliveryService.listStudentSubmissionsByHomeWorkId(
      user.id,
      homeWorkId,
    );
  }

  @Patch('/submission/attachement/:homeWorkid')
  update(@Param('homeWorkid') homeWorkid: string, @Body() url) {
    return this.evaluationDeliveryService.updateAttachement(homeWorkid, url);
  }
}
