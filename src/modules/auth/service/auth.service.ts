import { ChangePasswordDTO } from './../dtos/ChangePassword.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/service/user.service';
import { randomBytes } from 'crypto';

import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from 'src/errors/UnauthorizedError';
import { User } from '../../user/entities/user.entity';
import { UserToken } from '../models/UserToken';
import { GenerateRefreshToken } from '../providers/generateRefreshToken.provider';
import { GenerateToken } from '../providers/generateToken.provider';
import { MailerService } from '@nestjs-modules/mailer';
import { stringify } from 'querystring';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private generateRefreshToken: GenerateRefreshToken,
    private generateToken: GenerateToken,
    private mailerService: MailerService,
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

  async sendRecoverPasswordEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Não há usuário cadastrado com esse email.');
    }

    let recoverToken: string;
    recoverToken = randomBytes(32).toString('hex');
    await this.userService.updateRecoverToken(email, recoverToken);

    const mail = {
      to: user.email,
      from: 'noreply@application.com',
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: recoverToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }

  async resetPassword(
    recoverToken: string,
    changePasswordDTO: ChangePasswordDTO,
  ) {
    const user = await this.userService.findByRecoverToken(recoverToken);

    if (!user) throw new NotFoundException('token inválido');

    try {
      await this.changePassword(user.id, changePasswordDTO);
    } catch (error) {
      throw error;
    }
  }

  async changePassword(id: string, changePasswordDTO: ChangePasswordDTO) {
    const { password, passwordConfirmation } = changePasswordDTO;

    if (password != passwordConfirmation)
      throw new UnprocessableEntityException('As senhas não conferem');

    await this.userService.changePassword(id, password);
  }
}
