import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateSchoolDTO } from './../dtos/createSchool.dto';
import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { SchoolService } from '../service/school.service';
import { UpdateSchoolDTO } from './../dtos/updateSchool.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import { FindSchoolByRegionDTO } from '../dtos/findSchoolByRegion.dto';
@ApiTags('School')
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Public()
  create(@Body() createSchoolDTO: CreateSchoolDTO) {
    return this.schoolService.create(createSchoolDTO);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@User() user) {
    return this.schoolService.findAll(user.id);
  }

  @ApiBearerAuth()
  @Get('admin')
  findAllByAdmin(@Query() findSchoolByRegionDTO: FindSchoolByRegionDTO) {
    return this.schoolService.findAllByAdmin(findSchoolByRegionDTO);
  }

  @ApiBearerAuth()
  @Get('admin/cities')
  findCitiesBySchools() {
    return this.schoolService.findCitiesBySchools();
  }

  @ApiBearerAuth()
  @Get(':id')
  findSchoolById(@Param('id') id: string) {
    console.log('entro no errado');
    return this.schoolService.findSchoolById(id);
  }

  @ApiBearerAuth()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateInfoSchool: UpdateSchoolDTO) {
    return this.schoolService.update(id, updateInfoSchool);
  }
}
