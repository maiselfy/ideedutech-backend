import { RefreshToken, TypeUser } from '@prisma/client';

export interface SponsorToken {
  accessToken: string;
  refreshToken: RefreshToken;
}
