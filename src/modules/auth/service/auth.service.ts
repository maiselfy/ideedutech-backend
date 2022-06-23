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
import { StudentService } from 'src/modules/student/services/student.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private studentService: StudentService,
    private generateRefreshToken: GenerateRefreshToken,
    private generateToken: GenerateToken,
    private mailerService: MailerService,
  ) {}

  async login(login: string, password: string): Promise<UserToken> {
    const user = await this.validateUser(login, password);

    if (!user) {
      throw new HttpException(
        `Dados de email ou senha estão incorretos.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = await this.generateToken.generateToken(user.userId);

    const refreshToken = await this.generateRefreshToken.generateRefreshToken(
      user.userId,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async validateUser(login: string, password: string) {
    const typeValue = login.indexOf('@') > -1;

    if (!typeValue) {
      const user = await this.studentService.findByEnrollment(login);

      if (!user) {
        throw new UnauthorizedError(
          'Não existe um usuário com esse email em nossa base de dados.',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError(
          'Senha incorreta, por favor, tente novamente.',
        );
      }

      const userId = user.userId;

      return {
        userId,
        password: undefined,
      };
    } else {
      const user = await this.userService.findByEmail(login);
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

      const userId = user.id;

      return {
        userId,
        password: undefined,
      };
    }
  }

  generateRandomString() {
    var randomString = '';
    var strings =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 6; i++) {
      randomString += strings.charAt(
        Math.floor(Math.random() * strings.length),
      );
    }
    return randomString;
  }

  async sendRecoverPasswordEmail(sendRecoverPasswordDTO) {
    const { email } = sendRecoverPasswordDTO;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Não há usuário cadastrado com esse email.');
    }

    let recoverToken: string = this.generateRandomString();

    await this.userService.updateRecoverToken(email, recoverToken);

    const mail = {
      to: user.email,
      from: 'naoresponda@ideedutec.com.br',
      subject: 'Solicitação de alteração de senha',
      template: 'recover-password',
      context: {
        token: recoverToken,
      },
    };

    await this.mailerService.sendMail(mail);
  }

  async verifyToken(recoverToken: string) {
    const user = await this.userService.findByRecoverToken(recoverToken);

    if (!user) throw new NotFoundException('Token Inválido');
  }

  async resetPassword(token: string, changePasswordDTO: ChangePasswordDTO) {
    try {
      const user = await this.userService.findByRecoverToken(token);

      if (!user) throw new NotFoundException('token inválido');

      await this.changePassword(user.id, changePasswordDTO);
    } catch (error) {
      return new HttpException('Failed!!!', HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(
    userId: string,
    changePasswordDTO: ChangePasswordDTO,
  ): Promise<void> {
    const { password, passwordConfirmation } = changePasswordDTO;

    if (password == passwordConfirmation)
      throw new UnprocessableEntityException('As senhas não conferem');

    await this.userService.changePassword(userId, password);
  }
}
