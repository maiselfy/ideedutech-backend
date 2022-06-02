import { ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import CreateRefreshTokenDTO from '../dtos/createRefreshToken.dto';
import { RefreshTokenService } from '../services/refreshToken.service';

@ApiTags('Refresh Token')
@Controller('refreshToken')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Public()
  @Post()
  create(@Body() createRefreshTokenDTO: CreateRefreshTokenDTO) {
    return this.refreshTokenService.createNewToken(createRefreshTokenDTO);
  }
}
