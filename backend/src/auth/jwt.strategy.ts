// backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // we’ll store it in this property if you ever need it later
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    // 1) grab the secret from the injected ConfigService
    const secret = configService.get<string>('NEXTAUTH_SECRET');
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET must be defined');
    }

    // 2) call super() with the options, *before* using `this`
    super({
      jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:     secret,
    } as StrategyOptions);

    // 3) now that super() is done, we can assign to `this`
    this.configService = configService;
  }

  async validate(payload: any) {
    // This return value is attached to req.user
    return { userId: payload.sub, email: payload.email };
  }
}
