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

import { ActivityService } from '../service/activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  /* @Post
  @Public */
  create(@Body() createActivityDTO) {
    return this.activityService.create(createActivityDTO);
  }
}
