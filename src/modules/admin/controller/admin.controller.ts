import { ApiTags } from '@nestjs/swagger';
import { AdminService } from '../service/admin.service';
import { Body, Controller, Post } from '@nestjs/common';
import CreateAdminDTO from '../dtos/createAdmin.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Public()
  create(@Body() createAdminDTO: CreateAdminDTO) {
    return this.adminService.create(createAdminDTO);
  }
}
