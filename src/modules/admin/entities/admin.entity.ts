import { Prisma } from '@prisma/client';

export class Admin {
  id?: string;
  status: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
