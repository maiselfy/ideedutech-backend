import { StudentService } from './../services/student.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import ListEntitiesForSchoolDTO from '../dtos/listEntitiesForSchool.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get('/list')
  findStudentsBySchool(
    @Body() { schoolId, managerId }: ListEntitiesForSchoolDTO,
  ) {
    return this.studentService.findBySchool({ schoolId, managerId });
  }
}
