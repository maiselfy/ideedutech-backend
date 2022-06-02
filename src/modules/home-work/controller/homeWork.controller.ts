import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HomeWorkService } from '../service/homeWorkService.service';

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

  @Get()
  findHomeWorksForTeacher(@Param('teacherId') teacherId: string) {
    return this.homeWorkService.listHomeWorksByTeacher(teacherId);
  }
}
