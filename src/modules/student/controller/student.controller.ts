import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
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

  @Public()
  @Post()
  create(@Body() createStudentDTO: any) {
    return this.studentService.create(createStudentDTO);
  }

  @Post('manager')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreatePolicyHandler('Student'))
  createByAdmin(@Body() createStudentDTO: any) {
    return this.studentService.createByAdmin(createStudentDTO);
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
}
