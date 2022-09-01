import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { StudentService } from './../services/student.service';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { User } from 'src/modules/user/decorators/user.decorator';
import { CheckPolicies } from 'src/security/decorators/policy.decorator';
import { PoliciesGuard } from 'src/security/guards/policy.guard';
import { CreatePolicyHandler } from 'src/security/policies/create.policy';
@ApiTags('Student')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('/manager')
  create(@Body() createStudentDTO: any, @User() user) {
    const managerId = user.id;

    return this.studentService.create(createStudentDTO, managerId);
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

  @Get('classes/:classId')
  findStudentsByClassId(@Param('classId') classId: string) {
    return this.studentService.findStudentsByClassId(classId);
  }

  @Get(':studentId')
  detailOfStudent(@Param('studentId') studentId: string) {
    return this.studentService.detailOfStudent(studentId);
  }

  @Public()
  @Get('all-activities/:userId')
  findAllActivitiesForTheStudent(
    @Param('userId') userId: string,
    @Query()
    filters?: { disciplineId?: string; type?: string; createdAt?: string },
  ) {
    return this.studentService.findAllActivities(userId, filters);
  }

  @Public()
  @Get('all-notes/:userId')
  findAllNotesForTheStudentByPeriod(@Param('userId') userId: string) {
    return this.studentService.findAllNotesByPeriod(userId);
  }

  @Patch('update/class/:studentId')
  updateClassOfStudent(
    @Param('studentId') studentId: string,
    @Body() updateStudentDto,
  ) {
    return this.studentService.updateClassOfStudent(
      studentId,
      updateStudentDto,
    );
  }

  @Public()
  @Get('all-report-card/')
  findAllNotesByReportCard(@User() user) {
    return this.studentService.findAllNotesByReportCard(user.id);
  }
}
