import { Module } from '@nestjs/common';
import { AddressService } from './service/address.service';
import { AddressController } from './controller/address.controller';
import { PrismaService } from '../prisma';

@Module({
  controllers: [AddressController],
  providers: [AddressService, PrismaService]
})
export class AddressModule {}
