import { Prisma } from '@prisma/client';

export class Manager {
  id?: string;
  status: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
