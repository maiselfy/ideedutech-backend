import { RegisterClassModule } from './modules/register-class/registerClass.module';
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
import { StudentModule } from './modules/student/student.module';
import { AppService } from './app.service';
import { PeriodModule } from './modules/period/period.module';
import { ContentModule } from './modules/content/content.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './configs/mailer.config';
import { EvaluativeDeliveryModule } from './modules/evaluative-delivery/evaluativeDelivery.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { UploadModule } from './modules/upload/upload.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { GradebookModule } from './modules/gradebook/gradebook.module';

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
    TeacherModule,
    RefreshTokenModule,
    ClassModule,
    DisciplineScheduleModule,
    DisciplineModule,
    ContentModule,
    PeriodModule,
    RegisterClassModule,
    EvaluativeDeliveryModule,
    MailerModule.forRoot(mailerConfig),
    LessonModule,
    UploadModule,
    ScheduleModule,
    GradebookModule,
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
