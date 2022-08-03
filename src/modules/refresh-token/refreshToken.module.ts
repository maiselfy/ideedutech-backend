import { Module } from '@nestjs/common';
import { RefreshTokenService } from './services/refreshToken.service';
import { RefreshTokenController } from './controller/refreshToken.controller';
import { PrismaService } from '../prisma';
import { GenerateRefreshToken } from '../auth/providers/generateRefreshToken.provider';
import { GenerateToken } from '../auth/providers/generateToken.provider';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/service/user.service';
import { StudentService } from '../student/services/student.service';
import { ManagerService } from '../manager/service/manager.service';
import { ClassService } from '../class/services/class.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [RefreshTokenController],
  providers: [
    RefreshTokenService,
    PrismaService,
    GenerateRefreshToken,
    GenerateToken,
    UserService,
    StudentService,
    ManagerService,
    ClassService,
  ],
})
export class RefreshTokenModule {}
