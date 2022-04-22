import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
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

  @Public()
  @Get()
  findAll() {
    return this.waitlistService.findAll();
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') email: string) {
    return this.waitlistService.remove(email).catch((e) => {
      throw new NotFoundException(e.message);
    });
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.waitlistService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWaitlistDto: UpdateWaitlistDto) {
  //   return this.waitlistService.update(+id, updateWaitlistDto);
  // }
}
