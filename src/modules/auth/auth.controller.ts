import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDTO } from './dtos/LoginRequest.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService);

  @Post()
  @HttpCode(HttpStatus.OK)
  login(@Body() { email, password }: LoginRequestDTO) {
    return this.authService.login(email, password);
  }
}
