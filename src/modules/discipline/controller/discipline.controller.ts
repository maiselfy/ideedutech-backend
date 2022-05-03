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
import { DisciplineService } from '../service/discipline.service';
import { CreateDisciplineDTO } from '../dtos/createDiscipline.dto';
import { UpdateDisciplineDto } from '../dtos/updateDiscipline.dto';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { User } from 'src/modules/user/decorators/user.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Public()
  @Post()
  create(@Body() createDisciplineDTO) {
    return this.disciplineService.cre;

    ate(createDisciplineDTO);
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

  @Get('/disciplines/:classId')
  findDisciplinesOfClassBySchool(
    @User() user,
    @Param('classId') classId: string,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const managerId = user.id;
    return this.disciplineService.findDisciplinesOfClassBySchool(
      {
        managerId,
        classId,
      },
      paginationDTO,
    );
  }
}
