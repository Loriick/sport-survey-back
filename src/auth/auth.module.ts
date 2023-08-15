import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { USER_SERVICE } from 'src/utils/constants';
import { JwtAuthModule } from './jwt/jwt.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtAuthModule],
  controllers: [AuthController],
  providers: [GoogleStrategy, { provide: USER_SERVICE, useClass: UserService }],
})
export class AuthModule {}
