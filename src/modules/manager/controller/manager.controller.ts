import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { CreateManagerDTO } from '../dtos/createManager.dto';
import { ManagerService } from '../service/manager.service';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Public()
  @Post()
  create(@Body() createManagerDto: CreateManagerDTO) {
    return this.managerService.create(createManagerDto);
  }

  // @Get()
  // findAll() {
  //   return this.managerService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.managerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateManagerDto: UpdateManagerDto) {
  //   return this.managerService.update(+id, updateManagerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.managerService.remove(+id);
  // }
}
