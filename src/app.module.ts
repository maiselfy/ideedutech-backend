import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './modules/address/address.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwtAuthGuard';
import { SchoolModule } from './modules/school/school.module';
import { WaitlistModule } from './modules/waitlist/waitlist.module';
import { AdminModule } from './modules/admin/admin.module';
import { ManagerModule } from './modules/manager/manager.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { RefreshTokenModule } from './modules/refresh-token/refreshToken.module';
import { HomeWorkModule } from './modules/home-work/homeWork.module';
import { ClassModule } from './modules/class/class.module';
import { DisciplineScheduleModule } from './modules/discipline-schedule/discipline-schedule.module';
import { DisciplineModule } from './modules/discipline/discipline.module';

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
    TeacherModule,
    RefreshTokenModule,
    ClassModule,
    DisciplineScheduleModule,
    DisciplineModule,
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
