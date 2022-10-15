import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateClassDTO } from '../dtos/create-class.dto';
import { ClassService } from '../services/class.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { User } from 'src/modules/user/decorators/user.decorator';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createClassDto: CreateClassDTO) {
    return this.classService.create(createClassDto);
  }

  @ApiBearerAuth()
  @Get('/classes/:schoolId')
  findClassesBySchool(
    @User() user,
    @Param('schoolId') schoolId: string,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const managerId = user.id;
    return this.classService.findClassesBySchool(
      { schoolId, managerId },
      paginationDTO,
    );
  }

  @ApiBearerAuth()
  @Get('/students/:classId')
  findStudentsByClass(@Param('classId') classId: string) {
    return this.classService.findStudentsByClass(classId);
  }

  @ApiBearerAuth()
  @Get('/classes')
  findClassesOfTeacher(@User() user, @Query() paginationDTO: PaginationDTO) {
    return this.classService.getClassesOfTeacher(user.id, paginationDTO);
  }

  @ApiBearerAuth()
  @Get('/:classId')
  detailOfClass(@Param('classId') classId: string) {
    return this.classService.detailOfClass(classId);
  }

  @ApiBearerAuth()
  @Delete('/delete/:classId')
  remove(@Param('classId') classId: string) {
    return this.classService.remove(classId);
  }
}
