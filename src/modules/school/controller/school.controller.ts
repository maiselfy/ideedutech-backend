import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { User } from 'src/modules/user/decorators/user.decorator';
import { SchoolService } from '../service/school.service';

@ApiTags('School')
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

  @Put(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateInfoSchool) {
    return this.schoolService.update(id, updateInfoSchool);
  }
}
