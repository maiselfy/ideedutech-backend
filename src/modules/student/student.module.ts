import { PrismaService } from 'src/modules/prisma';
import { StudentService } from './services/student.service';
import { StudentController } from './controller/student.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaService],
})
export class StudentModule {}
