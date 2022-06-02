import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { EvaluativeDeliveryService } from '../services/evaluativeDelivery.service';
import CreateEvaluativeDeliveryDTO from '../dtos/evaluativeDelivery.dto';

@ApiTags('EvaluativeDelivery')
@Controller('evaluative-delivery')
export class EvaluativeDeliveryController {
  constructor(
    private readonly evaluationDeliveryService: EvaluativeDeliveryService,
  ) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createEvaluativeDeliveryDTO: CreateEvaluativeDeliveryDTO) {
    return this.evaluationDeliveryService.create(createEvaluativeDeliveryDTO);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.evaluationDeliveryService.findAll();
  }
}
