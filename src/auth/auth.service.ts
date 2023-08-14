import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { User as UserType } from 'src/types/user';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async validateUser(details: UserType) {
    const user = await this.userRepository.findOneBy({ email: details.email });
    if (user) return user;
    const newUser = this.userRepository.create(details);
    return this.userRepository.save(newUser);
  }

  async findUser(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });

    return user;
  }

  async updateUser({ data, id }: { data: Partial<UserType>; id: number }) {
    try {
      const user = await this.userRepository.findOneBy({ id });
      const updatedUser = {
        ...user,
        ...data,
      };

      return await this.userRepository.save(updatedUser);
    } catch (error) {
      console.log(error);
    }
  }
}
