import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HomeWorkService } from '../service/homeWork.service';
import { SearchHomeWorksByTeacherDTO } from '../dtos/searchHomeWorksByTeacher.dto';

@ApiTags('Home Work')
@Controller('homeWork')
export class HomeWorkController {
  constructor(private readonly homeWorkService: HomeWorkService) {}

  @Post()
  create(@Body() createHomeWorkDTO) {
    return this.homeWorkService.create(createHomeWorkDTO);
  }

  @Get()
  findAll() {
    return this.homeWorkService.findAll();
  }

  @Get('teacher/:teacherId')
  findHomeWorksForTeacher(
    @Param('teacherId') teacherId: string,
    @Query() searchHomeWorksByTeacher: SearchHomeWorksByTeacherDTO,
  ) {
    return this.homeWorkService.listHomeWorksByTeacher(
      teacherId,
      searchHomeWorksByTeacher,
    );
  }
}
