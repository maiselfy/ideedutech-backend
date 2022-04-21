import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';

import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from 'src/errors/UnauthorizedError';
import { User } from '../../user/entities/user.entity';
import { UserPayload } from '../models/UserPayload';
import { UserToken } from '../models/UserToken';
import { GenerateRefreshToken } from '../providers/generateRefreshToken.provider';
import { GenerateToken } from '../providers/generateToken.provider';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private generateRefreshToken: GenerateRefreshToken,
    private generateToken: GenerateToken,
  ) {}

  async login(email: string, password: string): Promise<UserToken> {
    const user: User = await this.validateUser(email, password);

    if (!user) {
      throw new HttpException(
        `Dados de email ou senha estão incorretos.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = await this.generateToken.generateToken(user.id);

    const refreshToken = await this.generateRefreshToken.generateRefreshToken(
      user.id,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(
        'Não existe um usuário com esse email em nossa base de dados.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        'Senha incorreta, por favor, tente novamente.',
      );
    }

    return {
      ...user,
      password: undefined,
    };
  }
}
