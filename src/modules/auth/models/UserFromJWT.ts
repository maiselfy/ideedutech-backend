import { User } from '@prisma/client';

export type UserFromJWT = Partial<User>;
