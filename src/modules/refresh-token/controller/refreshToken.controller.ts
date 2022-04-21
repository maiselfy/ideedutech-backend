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
import CreateRefreshTokenDTO from '../dtos/createRefreshToken.dto';
import { RefreshTokenService } from '../services/refreshToken.service';

@Controller('refreshToken')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Public()
  @Post()
  create(@Body() createRefreshTokenDTO: CreateRefreshTokenDTO) {
    return this.refreshTokenService.createNewToken(createRefreshTokenDTO);
  }

  // @Get()
  // findAll() {
  //   return this.refreshTokenService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.refreshTokenService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRefreshTokenDto: UpdateRefreshTokenDto,
  // ) {
  //   return this.refreshTokenService.update(+id, updateRefreshTokenDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.refreshTokenService.remove(+id);
  // }
}
