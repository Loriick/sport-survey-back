import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { USER_SERVICE } from 'src/utils/constants';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.userService.validateOrCreateUser({
      email: profile.emails[0].value,
      displayName: profile.displayName,
      username: '',
      picturePath: profile._json.picture,
      provider: 'google',
      providerId: profile.id,
    });

    return user || null;
  }
}
