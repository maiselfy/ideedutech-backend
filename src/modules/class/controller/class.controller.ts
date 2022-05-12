import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
<<<<<<< HEAD
=======
import { ApiTags } from '@nestjs/swagger';
>>>>>>> 8e5b9bc1e7f516d3b31e39a09c4f19e49a00fa3c
import { PaginationDTO } from 'src/models/PaginationDTO';
import { User } from 'src/modules/user/decorators/user.decorator';
import ListEntitiesForSchoolDTO from '../../student/dtos/listEntitiesForSchool.dto';
import { CreateClassDto } from '../dtos/create-class.dto';
import { ClassService } from '../services/class.service';

@ApiTags('class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get('/classes/:schoolId')
  findClassesBySchool(
    @User() user,
    @Param('schoolId') schoolId: string,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const managerId = user.id;
    return this.classService.findClassesBySchool(
      { schoolId, managerId },
      paginationDTO,
    );
  }

  // @Get()
  // findAll() {
  //   return this.classService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.classService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
  //   return this.classService.update(id, updateClassDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.classService.remove(+id);
  // }
}
