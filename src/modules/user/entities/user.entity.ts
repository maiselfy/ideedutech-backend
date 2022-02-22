import { Prisma } from '@prisma/client';

export class User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  birthDate: Date;
  phone: string;
  addressId: string;
  gender: string;
  createdAt?: Date;
  updatedAt?: Date;
}
