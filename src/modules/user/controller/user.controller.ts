import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../service/user.service';
import CreateUserDTO from '../dtos/createUser.dto';
import { User as UserDecorator } from '../decorators/user.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  getMe(@UserDecorator() user) {
    return user;
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findById(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string) {
  //   return this.userService.update(+Zid);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
