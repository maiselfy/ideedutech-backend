import { TypeUser } from '@prisma/client';

export interface SponsorPayload {
  nameOfStudent: string;
  email: string;
  sub: string;
  type: TypeUser;
}
