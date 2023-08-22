import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGards } from './utils/Gards';
import { Request, Response } from 'express';
import { JwtAuthService } from './jwt/jwt.service';
import { User } from 'src/types/user';

@Controller('auth')
export class AuthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @Get('/google/login')
  @UseGuards(GoogleAuthGards)
  handleLogin() {
    return {
      msg: 'Google Auth',
    };
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGards)
  handleRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = this.jwtAuthService.login(req.user as User);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    return res.redirect('/api/game/of-the-day');
  }
}
