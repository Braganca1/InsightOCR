import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy }                from '@nestjs/passport';
import { ExtractJwt, Strategy }            from 'passport-jwt';
import { Request }                         from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // look for the token in the cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return (
            req.cookies['next-auth.session-token'] ||
            req.cookies['__Secure-next-auth.session-token'] ||
            null
          );
        },
      ]),
      ignoreExpiration: false,
      // VERY IMPORTANT: read the exact same secret you use in NextAuth
      secretOrKey: process.env.NEXTAUTH_SECRET,
    });
  }

  validate(payload: any) {
    // If the secret was wrong, you'd never get here.
    // You can throw UnauthorizedException() if payload is malformed.
    return { userId: payload.sub, email: payload.email };
  }
}
