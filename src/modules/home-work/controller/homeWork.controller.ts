import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { HomeWorkService } from '../service/homeWork.service';
import { SearchHomeWorksByTeacherDTO } from '../dtos/searchHomeWorksByTeacher.dto';
import { User } from 'src/modules/user/decorators/user.decorator';
import CreateTestDTO from '../dtos/createTest.dto';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';
import { PaginationDTO } from 'src/models/PaginationDTO';

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

  @Get('/:homeWorkId')
  findHomeWorkById(@Param('homeWorkId') homeWorkId: string) {
    return this.homeWorkService.getDetailsOfHomework(homeWorkId);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updateInfoHomeWork) {
    return this.homeWorkService.update(id, updateInfoHomeWork);
  }

  @Get('/teacher/homeworks')
  findHomeWorksForTeacher(
    @User() user,
    @Query() searchHomeWorksByTeacher: SearchHomeWorksByTeacherDTO,
  ) {
    const teacherId = user.id;
    return this.homeWorkService.listHomeWorksByTeacher(
      teacherId,
      searchHomeWorksByTeacher,
    );
  }

  @Get('/teacher/class/homeworks')
  findHomeWorksForTeacherByClass(
    @User() user,
    @Query() searchHomeWorksByTeacher: SearchHomeWorksByTeacherDTO,
  ) {
    const teacherId = user.id;
    return this.homeWorkService.listHomeWorksByTeacherOnClass(
      teacherId,
      searchHomeWorksByTeacher,
    );
  }

  @Get('/teacher/activities')
  findActivitiesForTeacher(
    @User() user,
    @Query() searchHomeWorksByTeacher: SearchHomeWorksByTeacherDTO,
  ) {
    const teacherId = user.id;
    return this.homeWorkService.listactivitiesByTeacher(
      teacherId,
      searchHomeWorksByTeacher,
    );
  }

  @Delete('delete/:homeWorkId')
  deleteHomeWork(@Param('homeWorkId') homeWorkId: string) {
    return this.homeWorkService.deleteHomework(homeWorkId);
  }
}
