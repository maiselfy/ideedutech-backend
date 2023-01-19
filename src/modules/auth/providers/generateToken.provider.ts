import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserService } from 'src/modules/user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../models/UserPayload';
import { SponsorPayload } from '../models/SponsorPayload';

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

  async generateTokenForSponsor(sponsorId: string) {
    const sponsor = await this.prisma.sponsor.findUnique({
      where: {
        id: sponsorId,
      },
    });

    if (!sponsor) {
      throw new HttpException(
        `Erro! Responsável não cadastrado na nossa base de dados.`,
        HttpStatus.NOT_FOUND,
      );
    }

    const student = await this.prisma.student.findUnique({
      where: {
        id: sponsor.studentId,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!student) {
      throw new HttpException(
        `Erro! Responsável não está associado a nenhum estudante.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload: UserPayload = {
      name: student.user.name,
      email: sponsor.email,
      sub: student.user.id,
      type: sponsor.type,
      avatar: student.user.avatar,
    };

    const createdToken = this.jwtService.sign(payload);

    return createdToken;
  }
}
