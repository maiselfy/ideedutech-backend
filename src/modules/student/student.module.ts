import { PrismaService } from 'src/modules/prisma';
import { StudentService } from './services/student.service';
import { StudentController } from './controller/student.controller';
import { Module } from '@nestjs/common';
import { ManagerService } from '../manager/service/manager.service';
import { UserService } from '../user/service/user.service';
import { RefreshTokenService } from '../refresh-token/services/refreshToken.service';
import { GenerateRefreshToken } from '../auth/providers/generateRefreshToken.provider';
import { GenerateToken } from '../auth/providers/generateToken.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [StudentController],
  providers: [
    StudentService,
    PrismaService,
    ManagerService,
    UserService,
    RefreshTokenService,
    GenerateRefreshToken,
    GenerateToken,
  ],
})
export class StudentModule {}
