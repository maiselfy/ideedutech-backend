import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { GenerateRefreshToken } from 'src/modules/auth/providers/generateRefreshToken.provider';
import { GenerateToken } from 'src/modules/auth/providers/generateToken.provider';
import { PrismaService } from 'src/database/prisma.service';
import CreateRefreshTokenDTO from '../dtos/createRefreshToken.dto';

@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private generateRefreshToken: GenerateRefreshToken,
    private generateToken: GenerateToken,
  ) {}
  async createNewToken(createRefreshTokenDTO: CreateRefreshTokenDTO) {
    const { refreshToken } = createRefreshTokenDTO;

    const refreshTokenExists = await this.prisma.refreshToken.findUnique({
      where: {
        id: refreshToken,
      },
    });

    if (!refreshTokenExists) {
      throw new HttpException(
        {
          error: 'Os dados de refresh token não existem ou estão inválidos.',
          code: 'Invalid refresh token',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshTokenExists.expiresIn),
    );

    const newToken = await this.generateToken.generateToken(
      refreshTokenExists.userId,
    );

    if (refreshTokenExpired) {
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId: refreshTokenExists.userId,
        },
      });

      const newRefreshToken =
        await this.generateRefreshToken.generateRefreshToken(
          refreshTokenExists.userId,
        );

      return {
        newToken,
        newRefreshToken,
      };
    }

    return {
      newToken,
    };
  }
}
