import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Get } from '@nestjs/common';
import { RegisterClassService } from '../service/registerClassService.service';
import CreateRegisterClassDTO from '../dtos/createRegisterClass.dto';

@ApiTags('Register Class')
@Controller('registerClass')
export class RegisterClassController {
  constructor(private readonly registerClassService: RegisterClassService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createRegisterClassDTO: CreateRegisterClassDTO) {
    return this.registerClassService.create(createRegisterClassDTO);
  }

  @ApiBearerAuth()
  @Get(':disciplineId')
  getClassRegistersOfDiscipline(disciplineId: string) {
    return this.registerClassService.getClassRegistersOfDiscipline(
      disciplineId,
    );
  }
}
