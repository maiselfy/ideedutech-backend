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
import { User } from 'src/modules/user/decorators/user.decorator';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create() {}

  @Get()
  findAll() {}

  @Get('/school/:schoolId')
  findStudentsBySchool(@User() user, @Param('schoolId') schoolId: string) {
    return this.studentService.findBySchool({ schoolId, managerId: user.id });
  }
}
