import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import CreateEvaluationDTO from '../dtos/createEvaluation.dto';
import { EvaluationService } from '../services/evaluation.service';

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  create(@Body() createEvaluationDTO: CreateEvaluationDTO) {
    return this.evaluationService.create(createEvaluationDTO);
  }

  // @Get()
  // findAll() {
  //   return this.evaluationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.evaluationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateEvaluationDto: UpdateEvaluationDto,
  // ) {
  //   return this.evaluationService.update(+id, updateEvaluationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.evaluationService.remove(+id);
  // }
}
