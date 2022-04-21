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
import CreateWaitlistDTO from '../dtos/createWaitlist.dto';
import { WaitlistService } from '../service/waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Public()
  @Post()
  create(@Body() createWaitlistDTO: CreateWaitlistDTO) {
    return this.waitlistService.create(createWaitlistDTO);
  }

  // @Get()
  // findAll() {
  //   return this.waitlistService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.waitlistService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWaitlistDto: UpdateWaitlistDto) {
  //   return this.waitlistService.update(+id, updateWaitlistDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.waitlistService.remove(+id);
  // }
}
