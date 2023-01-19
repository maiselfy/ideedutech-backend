import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/database/prisma.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './service/auth.service';
import { GenerateRefreshToken } from './providers/generateRefreshToken.provider';
import { UserService } from '../user/service/user.service';
import { GenerateToken } from './providers/generateToken.provider';
import { StudentService } from '../student/services/student.service';
import { ManagerService } from '../manager/service/manager.service';
import { ClassService } from '../class/services/class.service';
import { SchoolService } from '../school/service/school.service';
import { PeriodService } from '../period/service/period.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GenerateRefreshToken,
    PrismaService,
    UserService,
    GenerateToken,
    StudentService,
    ManagerService,
    ClassService,
    SchoolService,
    PeriodService,
  ],
})
export class AuthModule {}
