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
  login(@Body() { login, password }: LoginRequestDTO) {
    return this.authService.login(login, password);
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
  @Patch('/verify-token/:token')
  async verifyToken(@Param('token') token: string) {
    await this.authService.verifyToken(token);

    return {
      message: 'Token verificado com sucesso',
    };
  }

  @Public()
  @Patch('/reset-password/:userId')
  async resetPassword(
    @Param('userId') userId: string,
    @Body() changePasswordDTO: ChangePasswordDTO,
  ) {
    await this.authService.resetPassword(userId, changePasswordDTO);

    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
