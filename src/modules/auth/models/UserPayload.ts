import { TypeUser } from '@prisma/client';

export interface UserPayload {
  name: string;
  email: string;
  sub: string;
  type: TypeUser;
  avatar: string;
}
