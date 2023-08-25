import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Team, Vote } from '../typeorm/entities';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Vote, Team])],
  controllers: [MatchController],
  providers: [MatchService, JwtService],
})
export class MatchModule {}
