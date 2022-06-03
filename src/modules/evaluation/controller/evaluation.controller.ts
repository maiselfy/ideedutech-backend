import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import CreateEvaluationDTO from '../dtos/createEvaluation.dto';
import { EvaluationService } from '../services/evaluation.service';

@ApiTags('Evaluation')
@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createEvaluationDTO: CreateEvaluationDTO) {
    return this.evaluationService.create(createEvaluationDTO);
  }
}
