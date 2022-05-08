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
import { PaginationDTO } from 'src/models/PaginationDTO';
import { User } from 'src/modules/user/decorators/user.decorator';
import { CreateTeacherDTO } from '../dtos/createTeacher.dto';
import { TeacherService } from '../services/teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  // @Post()
  // create(@Body() createTeacherDTO: CreateTeacherDTO) {
  //   return this.teacherService.create(createTeacherDTO);
  // }

  @Get('/school/:schoolId')
  findAllTeachersOnSchool(@User() user, @Param('schoolId') schoolId: string) {
    return this.teacherService.findAllTeachersOnSchool(schoolId, user.id);
  }

  @Get('/teachers/:schoolId')
  findTeachersBySchool(
    @User() user,
    @Param('schoolId') schoolId: string,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const managerId = user.id;

    return this.teacherService.findTeachersBySchool(
      { schoolId, managerId },
      paginationDTO,
    );
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.teacherService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
  //   return this.teacherService.update(+id, updateTeacherDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.teacherService.remove(+id);
  // }
}
