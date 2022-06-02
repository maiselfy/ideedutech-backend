import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PeriodService } from '../service/period.service';
import { CreatePeriodDTO } from '../dtos/create-period.dto';

@ApiTags('Period')
@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createPeriodDto: CreatePeriodDTO) {
    return this.periodService.create(createPeriodDto);
  }

  @ApiBearerAuth()
  @Get('/:schoolYear/school/:schoolId')
  findPeriodFromSchool(
    @Param('schoolId')
    schoolId: string,
    @Param('schoolYear') schoolYear: string,
  ) {
    return this.periodService.findPeriodFromSchool(schoolId, schoolYear);
  }
}
