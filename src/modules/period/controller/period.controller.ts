import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
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

  @Get('/:periodId')
  getPeriod(@Param('periodId') periodId: string) {
    return this.periodService.getPeriod(periodId);
  }

  @ApiBearerAuth()
  @Get('/school/:schoolId')
  findAllPeriodsBySchoolId(@Param('schoolId') schoolId: string) {
    return this.periodService.findAllPeriodsBySchoolId(schoolId);
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

  @Delete('/:periodId')
  deletePeriod(@Param('periodId') periodId: string) {
    return this.periodService.deletePeriodById(periodId);
  }

  @Put('/:periodId')
  updatePeriod(@Param('periodId') periodId: string, @Body() data) {
    return this.periodService.updatePeriodById(periodId, data);
  }
}
