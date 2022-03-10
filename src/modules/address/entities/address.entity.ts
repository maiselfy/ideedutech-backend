import { Prisma } from '@prisma/client';

export class Address {
  id?: string;
  labelAddress: string;
  address: string;
  city: string;
  number: string;
  area: string;
  uf: string;
  zipCode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

