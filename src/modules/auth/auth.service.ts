import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

import * as bcrypt from 'bcrypt';
import { UserToken } from './models/UserToken';
import { UserPayload } from './models/UserPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
  );

  login(email: string, password: string): Promise<UserToken> {
    const user: User = await this.validateUser(email, password);

    if (!user) {
    }

    const payload: UserPayload = {
      email: user.email,
      sub: user.id,
    };

    return {
      acessToken: this.jwtService.sign(payload),
    };
  }

  private async validateUser(email: string, password: string) {
    const user = this.userService.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Email is not exists');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Password is incorrect');
    }

    return {
      ...user,
      password: undefined,
    };
  }
}
