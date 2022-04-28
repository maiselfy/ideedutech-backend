import { Controller, Get, Post, Body } from '@nestjs/common';

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
