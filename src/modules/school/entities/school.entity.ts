import { Prisma, Role } from '@prisma/client';

export class School {
  id: string;
  name: string;
  phone: string;
  addressId?: string;
  cnpj?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
