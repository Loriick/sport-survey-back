import { Module } from '@nestjs/common';
import { LeaguesController } from './games.controller';
import { LeaguesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Vote } from 'src/typeorm/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Vote])],
  controllers: [LeaguesController],
  providers: [LeaguesService, JwtService],
})
export class LeaguesModule {}
