import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/security/decorators/public.decorator';
import { CreateLackOfClassDTO } from '../dtos/createLackOfClass.dto';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { TestDTO } from '../dtos/test.dto';
import { LackOfClassService } from '../services/lackOfClass.service';
import { LessonService } from '../services/lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private lackOfClassService: LackOfClassService,
  ) {}

  @Post()
  create(@Body() createLessonDTO: CreateLessonDTO) {
    return this.lessonService.create(createLessonDTO);
  }

  @Public()
  @Post('/lackOfClass')
  createLackOfClass(@Body() testDTO: any) {
    return this.lackOfClassService.create(testDTO);
  }

  // @Get()
  // findAll() {
  //   return this.lessonService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.lessonService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLessonDTO: UpdateLessonDTO) {
  //   return this.lessonService.update(+id, updateLessonDTO);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.lessonService.remove(+id);
  // }
}
