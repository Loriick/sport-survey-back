import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, User } from 'src/types/user';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    const { providerId, displayName } = user;
    const payload: JwtPayload = {
      sub: providerId,
      username: displayName,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
