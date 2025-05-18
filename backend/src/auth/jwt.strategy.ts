// backend/src/auth/jwt.strategy.ts
import { Injectable }                from '@nestjs/common';
import { PassportStrategy }          from '@nestjs/passport';
import { ExtractJwt, Strategy }      from 'passport-jwt';
import { Request }                   from 'express';
import { ConfigService }             from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('NEXTAUTH_SECRET')!;
    console.log('🔐 JwtStrategy loaded with NEXTAUTH_SECRET =', secret);

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          const cookieNames = Object.keys(req.cookies);
          console.log('🍪 Cookies on request:', cookieNames);

          // Grab the raw token string from whichever cookie is set
          const raw =
            req.cookies['next-auth.session-token'] ||
            req.cookies['__Secure-next-auth.session-token'] ||
            null;

          if (raw) {
            console.log('🧩 Raw token snippet:', raw.slice(0, 20) + '…');
          } else {
            console.log('⚠️ No session-token cookie found');
          }

          return raw;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:      secret,
    });
  }

  async validate(payload: any) {
    console.log('✅ JWT validated, payload:', payload);
    return { userId: payload.sub, email: payload.email };
  }
}
