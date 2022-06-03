import { CreateClassDTO } from '../dtos/create-class.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
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

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') classId: string) {
    return this.classService.remove(classId).catch((e) => {
      throw new NotFoundException(e.message);
    });
  }
}
