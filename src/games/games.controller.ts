import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LeaguesService } from './games.service';
import {
  AllMatchPerSeason,
  League,
  Match,
  Vote as VoteType,
} from '../types/leagues';
import { Vote } from '../typeorm/entities/MatchVote';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.gard';
import { ErrorReturnType } from 'src/types/error';

@Controller('game')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get('leagues')
  async getLeagues(): Promise<League[] | ErrorReturnType> {
    return await this.leaguesService.getLeagues();
  }

  @Get('of-the-day')
  @UseGuards(JwtAuthGuard)
  async getTodayMatch(): Promise<Match[] | ErrorReturnType> {
    return await this.leaguesService.getTodayMatch();
  }

  @Get('all/:leagueId')
  async getAllMatch(
    @Param('leagueId') leagueId: number,
  ): Promise<AllMatchPerSeason | ErrorReturnType> {
    return await this.leaguesService.getAllMatch(leagueId);
  }

  @Post('vote')
  @UseGuards(JwtAuthGuard)
  async voteMatch(@Body() vote: Vote): Promise<VoteType | ErrorReturnType> {
    return await this.leaguesService.voteMatch(vote);
  }
}
