import { Prisma, Role } from '@prisma/client';

export class Waitlist {
  id?: string;
  value: string;
  approved: boolean;
  schoolId: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}