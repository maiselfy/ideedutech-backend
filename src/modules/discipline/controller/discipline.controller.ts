import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DisciplineService } from '../service/discipline.service';
import { CreateDisciplineDTO } from '../dtos/createDiscipline.dto';
import { UpdateDisciplineDto } from '../dtos/updateDiscipline.dto';

@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Post()
  create(@Body() createDisciplineDTO) {
    return this.disciplineService.create(createDisciplineDTO);
  }

  @Get()
  findAll() {
    return this.disciplineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplineService.findTeacherDisciplines(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDisciplineDto: UpdateDisciplineDto,
  // ) {
  //   return this.disciplineService.update(+id, updateDisciplineDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.disciplineService.remove(+id);
  // }

  @Get(':teacherId')
  findTeacherDisciplines(@Param('teacherId') teacherId: string) {
    return this.disciplineService.findTeacherDisciplines(teacherId);
  }
}
