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
import { CreateDisciplineScheduleDTO } from '../dtos/create-discipline-schedule.dto';
import { UpdateDisciplineScheduleDto } from '../dtos/update-discipline-schedule.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Discipline Schedule')
@Controller('discipline-schedule')
export class DisciplineScheduleController {
  constructor(
    private readonly disciplineScheduleService: DisciplineScheduleService,
  ) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createDisciplineScheduleDto: CreateDisciplineScheduleDTO) {
    return this.disciplineScheduleService.create(createDisciplineScheduleDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@Query('day') day: string) {
    return this.disciplineScheduleService.findAll(day);
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplineScheduleService.findOne(+id);
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disciplineScheduleService.remove(+id);
  }
}
