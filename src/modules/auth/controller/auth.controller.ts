import { ChangePasswordDTO } from './../dtos/ChangePassword.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginRequestDTO } from '../dtos/LoginRequest.dto';
import { Public } from '../decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() { email, password }: LoginRequestDTO) {
    return this.authService.login(email, password);
  }

  @Public()
  @Post('/send-recover-email')
  async sendRecoverPasswordEmail(@Body('email') email: string) {
    await this.authService.sendRecoverPasswordEmail(email);
    return {
      message: 'Foi enviado um email com instruções para resetar sua senha',
    };
  }

  @Public()
  @Patch('/reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ) {
    await this.authService.resetPassword(token, changePasswordDTO);

    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
