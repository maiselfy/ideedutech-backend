import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { RegisterClassService } from '../service/registerClassService.service';

@ApiTags('Register Class')
@Controller('registerClass')
export class RegisterClassController {
  constructor(private readonly registerClassService: RegisterClassService) {}

  @Post()
  create(@Body() createRegisterClassDTO) {
    return this.registerClassService.create(createRegisterClassDTO);
  }
}
