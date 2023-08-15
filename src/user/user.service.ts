import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { User as UserType } from 'src/types/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async validateOrCreateUser(details: UserType) {
    try {
      const user = await this.userRepository.findOneBy({
        email: details.email,
      });
      if (user) return user;
      const newUser = this.userRepository.create(details);
      return this.userRepository.save(newUser);
    } catch (error) {
      console.log('error', error);
    }
  }

  async findUser(id: number) {
    try {
      console.log(id);
      const user = await this.userRepository.findOneBy({
        id,
      });

      return user;
    } catch (error) {
      console.error(error);
    }
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
