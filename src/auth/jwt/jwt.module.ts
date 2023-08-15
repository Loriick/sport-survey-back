import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthStrategy } from './jwt.strategy';
import { JwtAuthService } from './jwt.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME_SECONDS'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthService],
  exports: [JwtAuthService, JwtModule],
})
export class JwtAuthModule {}
