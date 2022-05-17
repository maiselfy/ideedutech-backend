import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplineScheduleDto } from './create-discipline-schedule.dto';

export class UpdateDisciplineScheduleDto extends PartialType(CreateDisciplineScheduleDto) {}
