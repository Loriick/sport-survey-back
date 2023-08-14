import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeaguesService } from './games.service';
import {
  AllMatchPerSeason,
  League,
  Match,
  Vote as VoteType,
} from '../types/leagues';
import { Vote } from '../typeorm/entities/MatchVote';

@Controller('game')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get('leagues')
  async getLeagues(): Promise<League[]> {
    return await this.leaguesService.getLeagues();
  }
  @Get('of-the-day')
  async getTodayMatch(): Promise<Match[]> {
    return await this.leaguesService.getTodayMatch();
  }
  @Get('all/:leagueId')
  async getAllMatch(
    @Param('leagueId') leagueId: number,
  ): Promise<AllMatchPerSeason> {
    return await this.leaguesService.getAllMatch(leagueId);
  }

  @Post('vote')
  async voteMatch(@Body() vote: Vote): Promise<VoteType> {
    return await this.leaguesService.voteMatch(vote);
  }
}
