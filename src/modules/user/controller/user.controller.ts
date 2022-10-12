import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, User as UserDecorator } from '../decorators/user.decorator';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateUserDTO from '../dtos/createUser.dto';
import UpdateUserDTO from '../dtos/updateUser.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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
  create(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }

  @Public()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateInfoUser: UpdateUserDTO) {
    return this.userService.update(id, updateInfoUser);
  }

  @Public()
  @Patch('upload/:userId')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadFile(
    @Param('userId') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(userId, avatar);
  }

  @Public()
  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }

  @Get('/mySchool')
  getSchoolOfLoggedUser(@User() user) {
    return this.userService.getSchoolOfLoggedUser(user.id);
  }
}
