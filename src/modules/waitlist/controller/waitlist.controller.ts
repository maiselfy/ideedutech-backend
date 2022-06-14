import { Role } from '@prisma/client';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateWaitlistDTO from '../dtos/createWaitlist.dto';
import { WaitlistService } from '../service/waitlist.service';
import { User } from 'src/modules/user/decorators/user.decorator';
import { PaginationDTO } from 'src/models/PaginationDTO';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Waitlist')
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

  @ApiBearerAuth()
  @Get('school/:schoolId/:role')
  getWaitlistByRole(
    @User() user,
    @Param('schoolId') schoolId: string,
    @Param('role') role: Role,
    @Query() paginationDTO: PaginationDTO,
  ) {
    const managerId = user.id;
    return this.waitlistService.findByRole(
      managerId,
      role,
      schoolId,
      paginationDTO,
    );
  }
}
