import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { StudentService } from './../services/student.service';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { User } from 'src/modules/user/decorators/user.decorator';
@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Public()
  @Post()
  create(@Body() createStudentDTO: any) {
    return this.studentService.create(createStudentDTO);
  }

  @Get('/students/:schoolId')
  findStudentsBySchool(
    @User() user,
    @Param('schoolId') schoolId: string,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const managerId = user.id;

    return this.studentService.findStudentsBySchool(
      { schoolId, managerId },
      paginationDTO,
    );
  }

  @Public()
  @Get('/students/:classId/:name')
  findStudentsByClass(
    @Param('name') name: string,
    @Param('classId') classId: string,
  ) {
    return this.studentService.findStudentsByClass(name, classId);
  }
}
