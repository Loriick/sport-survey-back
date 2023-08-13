import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AUTH_SERVICE } from 'src/utils/constants';
import { AuthService } from '../auth.service';
import { User } from 'src/typeorm/entities/User';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(AUTH_SERVICE) private readonly authService: AuthService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  serializeUser(user: User, done: Function) {
    done(null, user);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
  async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.findUser(payload.id);

    user ? done(null, user) : done(null, null);
  }
}
