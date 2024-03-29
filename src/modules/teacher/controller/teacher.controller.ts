import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  NotFoundException,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { User } from 'src/modules/user/decorators/user.decorator';
import { TeacherService } from '../services/teacher.service';

@ApiTags('Teacher')
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @ApiBearerAuth()
  @Post('/average-for-student')
  create(@Body() data) {
    return this.teacherService.createAverageForStudent(data);
  }

  @Put('average-for-student')
  updateAverage(@Body() data) {
    return this.teacherService.updateAverageForStudent(data)
  }

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

  @Get('/classes')
  findClassesByTeacherOnSchool(
    @User() user,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const teacherId = user.id;
    return this.teacherService.findClassesByTeacherOnSchool(
      teacherId,
      paginationDTO,
    );
  }

  @Get('/disciplines')
  findDisciplinesByTeacher(
    @User() user,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const teacherId = user.id;
    return this.teacherService.findDisciplinesByTeacher(
      teacherId,
      paginationDTO,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id).catch((e) => {
      throw new NotFoundException(e.message);
    });
  }
}
