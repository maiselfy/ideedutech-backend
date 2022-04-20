import { Prisma, Role } from '@prisma/client';

export class Student {
  id: string;
  schoolId: string;
  status: boolean;
  enrrollment: string;
  classId: string;
  entryForm: string;
  reasonForTransfer?: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
