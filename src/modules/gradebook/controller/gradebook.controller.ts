import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateGradebookDTO } from '../dtos/createGradebook.dto';
import { GradebookService } from '../services/gradebook.service';

@Controller('gradebook')
export class GradebookController {
  constructor(private readonly gradebookService: GradebookService) {}

  @Post()
  create(@Body() createGradebookDTO: CreateGradebookDTO) {
    return this.gradebookService.create(createGradebookDTO);
  }

  // @Get()
  // findAll() {
  //   return this.gradebookService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.gradebookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateGradebookDto: UpdateGradebookDto,
  // ) {
  //   return this.gradebookService.update(+id, updateGradebookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.gradebookService.remove(+id);
  // }
}
