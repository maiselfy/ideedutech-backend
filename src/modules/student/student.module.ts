import { HomeWorkService } from '../home-work/service/homeWork.service';
import { PrismaService } from 'src/database/prisma.service';
import { StudentService } from './services/student.service';
import { StudentController } from './controller/student.controller';
import { Module } from '@nestjs/common';
import { ManagerService } from '../manager/service/manager.service';
import { UserService } from '../user/service/user.service';
import { RefreshTokenService } from '../refresh-token/services/refreshToken.service';
import { GenerateRefreshToken } from '../auth/providers/generateRefreshToken.provider';
import { GenerateToken } from '../auth/providers/generateToken.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CaslAbilityFactory } from 'src/security/casl/casl-ability.factory';
import { CaslAbilityService } from 'src/security/casl/services/casl.ability.service';
import { ClassService } from '../class/services/class.service';
import { SchoolService } from '../school/service/school.service';
import { PeriodService } from '../period/service/period.service';
import { DisciplineService } from '../discipline/service/discipline.service';

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
    CaslAbilityFactory,
    CaslAbilityService,
    ClassService,
    SchoolService,
    PeriodService,
    HomeWorkService,
    DisciplineService,
  ],
})
export class StudentModule {}
