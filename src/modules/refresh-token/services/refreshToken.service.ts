import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GenerateRefreshToken } from 'src/modules/auth/providers/generateRefreshToken.provider';
import { GenerateToken } from 'src/modules/auth/providers/generateToken.provider';
import { PrismaService } from 'src/modules/prisma';
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
      throw new HttpException(`Refresh token inválido.`, HttpStatus.NOT_FOUND);
    }

    const newToken = await this.generateToken.generateToken(
      refreshTokenExists.userId,
    );

    return {
      newToken,
    };
  }
}
