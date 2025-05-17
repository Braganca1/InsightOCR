import { Module }        from '@nestjs/common';
import { ConfigModule, ConfigService }  from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule }     from '@nestjs/jwt';
import { JwtStrategy }   from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('NEXTAUTH_SECRET'),
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}