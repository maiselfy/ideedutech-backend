import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { RegisterClassService } from '../service/registerClassService.service';
import CreateRegisterClassDTO from '../dtos/createRegisterClass.dto';
import UpdateRegisterClassDTO from '../dtos/UpdateRegisterClass.dto';

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
  @Put(':registerClassId')
  update(
    @Param() registerClassId: string,
    @Body() updateRegisterClassDTO: UpdateRegisterClassDTO,
  ) {
    return this.registerClassService.update(
      registerClassId,
      updateRegisterClassDTO,
    );
  }

  @ApiBearerAuth()
  @Get(':disciplineId')
  getClassRegistersOfDiscipline(disciplineId: string) {
    return this.registerClassService.getClassRegistersOfDiscipline(
      disciplineId,
    );
  }
}
