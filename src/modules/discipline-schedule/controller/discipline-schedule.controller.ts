import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DisciplineScheduleService } from '../service/discipline-schedule.service';
import { CreateDisciplineScheduleDto } from '../dtos/create-discipline-schedule.dto';
import { UpdateDisciplineScheduleDto } from '../dtos/update-discipline-schedule.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Discipline Schedule')
@Controller('discipline-schedule')
export class DisciplineScheduleController {
  constructor(
    private readonly disciplineScheduleService: DisciplineScheduleService,
  ) {}

  @Post()
  create(@Body() createDisciplineScheduleDto: CreateDisciplineScheduleDto) {
    return this.disciplineScheduleService.create(createDisciplineScheduleDto);
  }

  @Get()
  findAll(@Query('day') day: string) {
    return this.disciplineScheduleService.findAll(day);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplineScheduleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDisciplineScheduleDto: UpdateDisciplineScheduleDto,
  ) {
    return this.disciplineScheduleService.update(
      +id,
      updateDisciplineScheduleDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disciplineScheduleService.remove(+id);
  }
}
