import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplineScheduleDTO } from './create-discipline-schedule.dto';

export class UpdateDisciplineScheduleDto extends PartialType(
  CreateDisciplineScheduleDTO,
) {}
