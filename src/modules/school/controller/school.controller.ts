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
import { User } from '../../user/decorators/user.decorator';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Public()
  create(@Body() createSchoolDTO) {
    return this.schoolService.create(createSchoolDTO);
  }

  @Get()
  @Public()
  findAll() {
    return this.schoolService.findAll();
  }

  @Get('/manager/:id')
  findSchoolByManagerId(@Param('id') id: string) {
    console.log(1, id);
    return this.schoolService.findSchoolsByManagerId(id);
  }

  @Get('/:id')
  findSchoolById(@Param('id') id: string, @User() user) {
    console.log(1, id);
    console.log(2, user);
    return this.schoolService.findSchoolById(id, user.id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
  //   return this.schoolService.update(+id, updateSchoolDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.schoolService.remove(+id);
  // }
}
