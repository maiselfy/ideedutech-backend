import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User as UserDecorator } from '../decorators/user.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  getMe(@UserDecorator() user) {
    return user;
  }

  @Public()
  @Post()
  create(@Body() createUserDto: any) {
    return this.userService.create(createUserDto);
  }
}
