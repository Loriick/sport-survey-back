import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'src/types/user';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const extractJwtFromCookie = (req: Request) => {
      let token = null;

      if (req && req.cookies) {
        token = req.cookies['jwt'];
      }
      return token;
    };
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        extractJwtFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload: JwtPayload) {
    const { username, sub } = payload;
    return { username, id: sub };
  }
}
