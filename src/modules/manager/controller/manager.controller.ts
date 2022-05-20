import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { User } from 'src/modules/user/decorators/user.decorator';
import { CreateManagerDTO } from '../dtos/createManager.dto';
import { ManagerService } from '../service/manager.service';

@ApiTags('Manager')
@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Public()
  @Post()
  create(@Body() createManagerDto: CreateManagerDTO) {
    return this.managerService.create(createManagerDto);
  }

  @Get('/managers/:schoolId')
  findManagersBySchool(
    @User() user,
    @Param('schoolId') schoolId: string,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const managerId = user.id;
    return this.managerService.findManagersBySchool(
      { schoolId, managerId },
      paginationDTO,
    );
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
