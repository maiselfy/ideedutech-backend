import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateHomeWorkDTO from '../dtos/createHomeWork.dto';
import { HomeWorkService } from '../service/homeWorkService.service';

@Controller('homeWork')
export class HomeWorkController {
  constructor(private readonly homeWorkService: HomeWorkService) {}

  @Post()
  create(@Body() createHomeWorkDTO) {
    return this.homeWorkService.create(createHomeWorkDTO);
  }

  @Get()
  findAll() {
    return this.homeWorkService.findAll();
  }
}
