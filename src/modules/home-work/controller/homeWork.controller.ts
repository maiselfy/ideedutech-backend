import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HomeWorkService } from '../service/homeWork.service';
import { SearchHomeWorksByTeacherDTO } from '../dtos/searchHomeWorksByTeacher.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import CreateTestDTO from '../dtos/createTest.dto';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';

@ApiTags('Home Work')
@Controller('homeWork')
export class HomeWorkController {
  constructor(private readonly homeWorkService: HomeWorkService) {}

  @Post()
  createHomeWork(@Body() createHomeWorkDTO: CreateHomeWorkDTO) {
    return this.homeWorkService.createHomeWork(createHomeWorkDTO);
  }

  @Post('/test')
  createTest(@Body() createTestDTO: CreateTestDTO) {
    return this.homeWorkService.createTest(createTestDTO);
  }

  @Get()
  findAll() {
    return this.homeWorkService.findAll();
  }

  @Get('teacher')
  findHomeWorksForTeacher(
    @User() user,
    @Query() searchHomeWorksByTeacher: SearchHomeWorksByTeacherDTO,
  ) {
    return this.homeWorkService.listHomeWorksByTeacher(
      user.id,
      searchHomeWorksByTeacher,
    );
  }
}
