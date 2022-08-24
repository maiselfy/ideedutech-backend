import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContentService } from './../service/content.service';
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import CreateContentDTO from '../dtos/createContent.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiBearerAuth()
  @Post()
  create(@Body() createContentDTO: CreateContentDTO) {
    return this.contentService.create(createContentDTO);
  }

  @ApiBearerAuth()
  @Public()
  @Get('/:periodId/:disciplineId')
  findAllContentsPeriodByDisciplineId(
    @Param('disciplineId') disciplineId: string,
    @Param('periodId') periodId: string,
  ) {
    return this.contentService.findAllContentsPeriodByDisciplineId(
      disciplineId,
      periodId,
    );
  }

  @ApiBearerAuth()
  @Get('/discipline/contents/:disciplineId')
  findContentsByDiscipline(@Param('disciplineId') disciplineId: string) {
    return this.contentService.findContentsByDiscipline(disciplineId);
  }

  @ApiBearerAuth()
  @Get('/discipline/singleContents/:disciplineId')
  getSingleContents(@Param('disciplineId') disciplineId: string) {
    return this.contentService.getSingleContents(disciplineId);
  }

  @ApiBearerAuth()
  @Delete('delete/:contentId')
  deleteContent(@Param('contentId') contentId: string) {
    return this.contentService.deleteContent(contentId);
  }
}
