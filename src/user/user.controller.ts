import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/types/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: AuthService) {}

  @Post('update/:id')
  async updateUser(
    @Body() data: Partial<User>,
    @Param('id') id: number,
  ): Promise<User> {
    return this.userService.updateUser({ data, id });
  }
}
