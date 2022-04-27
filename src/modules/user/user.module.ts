import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { PrismaService } from '../prisma';
import { StudentService } from '../student/services/student.service';
import { ManagerService } from '../manager/service/manager.service';
import { RefreshTokenService } from '../refresh-token/services/refreshToken.service';
import { GenerateRefreshToken } from '../auth/providers/generateRefreshToken.provider';
import { GenerateToken } from '../auth/providers/generateToken.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    StudentService,
    ManagerService,
    RefreshTokenService,
    GenerateRefreshToken,
    GenerateToken,
  ],
  exports: [UserService],
})
export class UserModule {}
