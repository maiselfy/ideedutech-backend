import { ContentService } from './../service/content.service';
import { Controller, Get, Post, Body } from '@nestjs/common';
import CreateContentDTO from '../dtos/createContent.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(@Body() createContentDTO: CreateContentDTO) {
    return this.contentService.create(createContentDTO);
  }

  @Get()
  findAll() {}
}
