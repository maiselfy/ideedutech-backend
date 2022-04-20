import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import CreatePlanEducationDTO from '../dtos/createPlan-education.dto';
import { PlanEducationService } from '../services/plan-education.service';

@Controller('plan-education')
export class PlanEducationController {
  constructor(private readonly planEducationService: PlanEducationService) {}

  @Post()
  create(@Body() createPlanEducationDTO: CreatePlanEducationDTO) {
    return this.planEducationService.create(createPlanEducationDTO);
  }

  // @Get()
  // findAll() {
  //   return this.planEducationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.planEducationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updatePlanEducationDto: UpdatePlanEducationDto,
  // ) {
  //   return this.planEducationService.update(+id, updatePlanEducationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.planEducationService.remove(+id);
  // }
}
