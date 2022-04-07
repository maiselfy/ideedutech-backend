import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateTeacherDTO } from '../dtos/createTeacher.dto';
import { TeacherService } from '../services/teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  // @Post()
  // create(@Body() createTeacherDTO: CreateTeacherDTO) {
  //   return this.teacherService.create(createTeacherDTO);
  // }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.teacherService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
  //   return this.teacherService.update(+id, updateTeacherDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.teacherService.remove(+id);
  // }
}