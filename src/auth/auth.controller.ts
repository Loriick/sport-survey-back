import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGards } from './utils/gards';

@Controller('auth')
export class AuthController {
  @Get('/google/login')
  @UseGuards(GoogleAuthGards)
  handleLogin() {
    return {
      msg: 'Google Auth',
    };
  }

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGards)
  handleRedirect() {
    return {
      msg: 'OK',
    };
  }
}
