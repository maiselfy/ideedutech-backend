import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CreateClassDTO } from '../dtos/create-class.dto';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClassService } from '../services/class.service';
import { User } from 'src/modules/user/decorators/user.decorator';

@ApiTags('Class')
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createClassDto: CreateClassDTO) {
    return this.classService.create(createClassDto);
  }

  @ApiBearerAuth()
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
