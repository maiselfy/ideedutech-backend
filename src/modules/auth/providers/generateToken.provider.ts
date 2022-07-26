import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma';
import { UserService } from 'src/modules/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../models/UserPayload';

@Injectable()
export class GenerateToken {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  async generateToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException(
        `Erro! Usuário não existe na nossa base de dados.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: UserPayload = {
      name: user.name,
      email: user.email,
      sub: user.id,
      type: user.type,
      avatar: user.avatar,
    };

    const createdToken = this.jwtService.sign(payload);

    return createdToken;
  }
}
