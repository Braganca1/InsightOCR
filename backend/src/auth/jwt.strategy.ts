// backend/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy }                from '@nestjs/passport';
import { ExtractJwt, Strategy }            from 'passport-jwt';
import { Request }                         from 'express';

// Standalone extractor — no `this` access here!
function cookieExtractor(req: Request) {
  const cookies = req.cookies || {};
  console.log('🍪 Cookies on request:', Object.keys(cookies));
  // Look for NextAuth session token in either cookie name:
  return (
    cookies['next-auth.session-token'] ||
    cookies['__Secure-next-auth.session-token'] ||
    null
  );
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    // Log that we picked up the secret
    console.log('🔐 JwtStrategy loaded with NEXTAUTH_SECRET =', process.env.NEXTAUTH_SECRET);

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.NEXTAUTH_SECRET,
    });
  }

  async validate(payload: any) {
    // Only called if token is valid
    console.log('✅ JWT validated, payload:', payload);
    return { userId: payload.sub, email: payload.email };
  }
}
