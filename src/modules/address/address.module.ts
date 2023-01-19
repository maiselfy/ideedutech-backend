import { Module } from '@nestjs/common';
import { AddressService } from './service/address.service';
import { AddressController } from './controller/address.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [AddressController],
  providers: [AddressService, PrismaService],
})
export class AddressModule {}
