import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

interface TokenPayload {
  iat: number;
  exp: number;
  id: string;
  name: string;
  email: string;
  type: string;
}

export function EnsureAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new HttpException('JWT token is missing', HttpStatus.BAD_REQUEST);
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const { id, name, email, type } = decoded as TokenPayload;
    req.user = { id, name, email, type };
    return next();
  } catch {
    throw new HttpException('Invalid JWT Token', HttpStatus.UNAUTHORIZED);
  }
}
