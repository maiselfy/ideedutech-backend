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
import { ClassService } from '../class/services/class.service';
import { SchoolService } from '../school/service/school.service';
import { PeriodService } from '../period/service/period.service';

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
    ClassService,
    SchoolService,
    PeriodService,
  ],
  exports: [UserService],
})
export class UserModule {}
