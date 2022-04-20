import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplineDTO } from './createDiscipline.dto';

export class UpdateDisciplineDto extends PartialType(CreateDisciplineDTO) {}
