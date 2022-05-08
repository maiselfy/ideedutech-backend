import { Prisma, Role } from '@prisma/client';

export class Submission {
  studentId: string;
  homeWorkId: string;
  rating?: number;
  dueDate: Date;
  attachement?: string;
  stage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
