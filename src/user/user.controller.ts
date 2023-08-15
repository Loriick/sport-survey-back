import { Body, Controller, Param, Post } from '@nestjs/common';
import { User } from 'src/types/user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update/:id')
  async updateUser(
    @Body() data: Partial<User>,
    @Param('id') id: number,
  ): Promise<User> {
    return this.userService.updateUser({ data, id });
  }
}
