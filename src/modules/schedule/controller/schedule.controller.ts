import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { User } from 'src/modules/user/decorators/user.decorator';
import { CreateScheduleDTO } from '../dtos/createSchedule.dto';
import { ScheduleService } from '../services/schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() createScheduleDTO: CreateScheduleDTO) {
    return this.scheduleService.create(createScheduleDTO);
  }

  @Get('/mySchedules/:date')
  getSchedulesOfTeacher(@User() user, @Param('date') date: string) {
    return this.scheduleService.getSchedulesOfTeacher(user.id, date);
  }

  @Get('/student/mySchedules/:date')
  getSchedulesOfStudent(@User() user, @Param('date') date: string) {
    return this.scheduleService.getSchedulesOfStudent(user.id, date);
  }

  @Get('/lesson/availableSchedules/:classId')
  getAvailableSchedulesForLesson(
    @User() user,
    @Param('classId') classId: string,
  ) {
    return this.scheduleService.getAvailableSchedules(user.id, classId);
  }

  @Get('/:scheduleId/lesson')
  getLessonBySchedule(@Param('scheduleId') scheduleId: string) {
    return this.scheduleService.getLessonBySchedule(scheduleId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.scheduleService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateScheduleDto: UpdateScheduleDto,
  // ) {
  //   return this.scheduleService.update(+id, updateScheduleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.scheduleService.remove(+id);
  // }
}
