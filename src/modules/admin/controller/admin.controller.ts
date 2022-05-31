import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import CreateAdminDTO from '../dtos/createAdmin.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Post()
  create(@Body() createAdminDTO: CreateAdminDTO) {
    return this.adminService.create(createAdminDTO);
  }
}
