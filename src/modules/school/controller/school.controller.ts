import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateSchoolDTO from '../dtos/createSchool.dto';
import { SchoolService } from '../service/school.service';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  create(@Body() createSchoolDTO: CreateSchoolDTO) {
    return this.schoolService.create(createSchoolDTO);
  }

  // @Get()
  // findAll() {
  //   return this.schoolService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.schoolService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
  //   return this.schoolService.update(+id, updateSchoolDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.schoolService.remove(+id);
  // }
}
