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

import { HomeWorkService } from '../service/homeWorkService.service';

@Controller('homeWork')
export class HomeWorkController {
  constructor(private readonly homeWorkService: HomeWorkService) {}

  /* @Post
  @Public */
  create(@Body() createActivityDTO) {
    return this.homeWorkService.create(createActivityDTO);
  }
}
