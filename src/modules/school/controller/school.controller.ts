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
import { User } from 'src/modules/user/decorators/user.decorator';
import CreateSchoolDTO from '../dtos/createSchool.dto';
import { SchoolService } from '../service/school.service';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Public()
  create(@Body() createSchoolDTO) {
    return this.schoolService.create(createSchoolDTO);
  }

  @Get()
  findAll(@User() user) {
    return this.schoolService.findAll(user.id);
  }

  @Get('/:id')
  findSchoolById(@User() user, @Param('id') id: string) {
    return this.schoolService.findSchoolById(id, user.id);
  }

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
