import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { DisciplineService } from '../service/discipline.service';
import { CreateDisciplineDTO } from '../dtos/createDiscipline.dto';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { User } from 'src/modules/user/decorators/user.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { UpdateDisciplineDTO } from '../dtos/updateDiscipline.dto';

@ApiTags('Discipline')
@Controller('discipline')
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createDisciplineDTO: CreateDisciplineDTO) {
    return this.disciplineService.create(createDisciplineDTO);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.disciplineService.findAll();
  }

  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disciplineService.findTeacherDisciplines(id);
  }

  @Get('/lacks/:disciplineId')
  absencesOfStudentsByDiscipline(@Param('disciplineId') disciplineId: string) {
    return this.disciplineService.findAbsencesOfStudentByDiscipline(
      disciplineId,
    );
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

  @ApiBearerAuth()
  @Get(':teacherId')
  findTeacherDisciplines(@Param('teacherId') teacherId: string) {
    return this.disciplineService.findTeacherDisciplines(teacherId);
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @Get('student/disciplines')
  findAllDisciplinesOfStudent(@User() user) {
    return this.disciplineService.findAllDisciplinesOfStudent(user.id);
  }

  @ApiBearerAuth()
  @Get('detail/:disciplineId')
  getDiscipline(@Param('disciplineId') disciplineId: string) {
    return this.disciplineService.getDiscipline(disciplineId);
  }

  @Patch('update/:disciplineId')
  updateTeacherOfDiscipline(
    @Param('disciplineId') disciplineId: string,
    @Body() updateDisciplineDTO: UpdateDisciplineDTO,
  ) {
    return this.disciplineService.updateDiscipline(
      disciplineId,
      updateDisciplineDTO,
    );
  }
}
