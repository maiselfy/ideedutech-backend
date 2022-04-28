import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AddressModule } from './modules/address/address.module';
import { JwtAuthGuard } from './modules/auth/jwtAuthGuard';
import { AdminModule } from './modules/admin/admin.module';
import { ManagerModule } from './modules/manager/manager.module';
import { WaitlistModule } from './modules/waitlist/waitlist.module';
import { SchoolModule } from './modules/school/school.module';
import { HomeWorkModule } from './modules/home-work/homeWork.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { RefreshTokenModule } from './modules/refresh-token/refreshToken.module';
import { ClassModule } from './modules/class/class.module';
import { DisciplineScheduleModule } from './modules/discipline-schedule/discipline-schedule.module';
import { DisciplineModule } from './modules/discipline/discipline.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { StudentModule } from './modules/student/student.module';
import { AppService } from './app.service';
import { PeriodModule } from './modules/period/period.module';
import { ContentModule } from './modules/content/content.module';

ConfigModule.forRoot();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    AddressModule,
    AdminModule,
    ManagerModule,
    WaitlistModule,
    SchoolModule,
    HomeWorkModule,
    StudentModule,
    SubmissionModule,
    TeacherModule,
    RefreshTokenModule,
    ClassModule,
    DisciplineScheduleModule,
    DisciplineModule,
    ContentModule,
    PeriodModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
