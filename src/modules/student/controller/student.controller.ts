import { StudentService } from './../services/student.service';
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
import ListEntitiesForSchoolDTO from '../dtos/listEntitiesForSchool.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateStudentDTO from '../dtos/createStudent.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Public()
  @Post()
  create(@Body() createStudentDTO: any) {
    return this.studentService.create(createStudentDTO);
  }

  @Get()
  findAll() {}

  // @Get('/school/:schoolId')
  // findStudentsBySchool(@User() user, @Param('schoolId') schoolId: string) {
  //   return this.studentService.findBySchool({ schoolId, managerId: user.id });
  // }

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
}
