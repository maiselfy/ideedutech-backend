import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { UpdateLessonDTO } from '../dtos/updateLesson.dto';
import { LessonService } from '../services/lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  create(@Body() createLessonDTO: CreateLessonDTO) {
    return this.lessonService.create(createLessonDTO);
  }

  // @Get()
  // findAll() {
  //   return this.lessonService.findAll();
  // }

  @Get(':id')
  detailOfLesson(@Param('lessonId') lessonId: string) {
    return this.lessonService.detailOfLesson(lessonId);
  }

  @Put('/update/:lessonId')
  update(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDTO: UpdateLessonDTO,
  ) {
    return this.lessonService.updateLesson(lessonId, updateLessonDTO);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.lessonService.remove(+id);
  // }
}
