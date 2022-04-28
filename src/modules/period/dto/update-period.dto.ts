import { PartialType } from '@nestjs/swagger';
import { CreatePeriodDTO } from './create-period.dto';

export class UpdatePeriodDto extends PartialType(CreatePeriodDTO) {}
