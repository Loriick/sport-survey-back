import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User';
import { User as UserType } from '../types/user';
import { errorMessage } from '../utils/constants';
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
      return {
        message: "Oups quelque chose s'est mal passé. veuillez réessayer",
      };
    }
  }

  async findUser(id: number) {
    try {
      const user = await this.userRepository.findOneBy({
        id,
      });

      return user;
    } catch (error) {
      return {
        message: errorMessage,
      };
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
      return {
        message: errorMessage,
      };
    }
  }
}
