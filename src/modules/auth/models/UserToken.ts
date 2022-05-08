import { RefreshToken } from '@prisma/client';

export interface UserToken {
  accessToken: string;
  refreshToken: RefreshToken;
}
