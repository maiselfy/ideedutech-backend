import { UpdateSchoolDTO } from './../dtos/updateSchool.dto';
import { CreateSchoolDTO } from './../dtos/createSchool.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { User } from 'src/modules/user/decorators/user.decorator';
import { SchoolService } from '../service/school.service';

@ApiTags('School')
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Public()
  create(@Body() createSchoolDTO: any) {
    return this.schoolService.create(createSchoolDTO);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@User() user) {
    return this.schoolService.findAll(user.id);
  }

  @ApiBearerAuth()
  @Get('/:id')
  findSchoolById(@User() user, @Param('id') id: string) {
    return this.schoolService.findSchoolById(id, user.id);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateInfoSchool: UpdateSchoolDTO) {
    return this.schoolService.update(id, updateInfoSchool);
  }
}
