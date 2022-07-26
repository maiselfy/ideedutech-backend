import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { Public } from 'src/security/decorators/public.decorator';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { CreateManyLackLessonDTO } from '../dtos/createManyLackLesson.dto';
import { LackOfClassService } from '../services/lackOfClass.service';
import { CreateLessonDTO } from '../dtos/createLesson.dto';
import { UpdateLessonDTO } from '../dtos/updateLesson.dto';
import { LessonService } from '../services/lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private lackOfClassService: LackOfClassService,
  ) {}
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  create(@Body() createLessonDTO: CreateLessonDTO) {
    return this.lessonService.create(createLessonDTO);
  }

  @Public()
  @Post('/lackOfClass')
  createLackOfClass(@Body() createManyLackLessonDTO: CreateManyLackLessonDTO) {
    return this.lackOfClassService.createMany(createManyLackLessonDTO);
  }

  @Public()
  @Put('/lackOfClass/:lessonId')
  updateLackOfLesson(
    @Param('lessonId') lessonId: string,
    @Body() createManyLackLessonDTO: CreateManyLackLessonDTO,
  ) {
    return this.lackOfClassService.updateLackOfLesson(
      lessonId,
      createManyLackLessonDTO,
    );
  }

  @Public()
  @Delete('/remove/:lessonId/:studentId/:date')
  removeLackOfClass(
    @Param('lessonId') lessonId: string,
    @Param('studentId') studentId: string,
    @Param('date') date: string,
  ) {
    return this.lackOfClassService.remove({ lessonId, studentId, date });
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
