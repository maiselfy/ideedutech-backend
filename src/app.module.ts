import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './auth/service/service.module';
import { AuthModule } from './service/auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ServiceModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
