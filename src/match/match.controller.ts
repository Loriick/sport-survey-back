import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import {
  AllMatchPerSeason,
  League,
  Match,
  Vote as VoteType,
} from '../types/leagues';
import { Vote } from '../typeorm/entities/MatchVote';
import { JwtAuthGuard } from '../auth/jwt/jwt.gard';
import { ErrorReturnType } from '../types/error';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('leagues')
  async getLeagues(): Promise<League[] | ErrorReturnType> {
    return await this.matchService.getLeagues();
  }

  @Get('of-the-day/:date/:leagueId?')
  async getTodayMatch(
    @Param('date') date: string,
    @Param('leagueId') leagueId?: number,
  ): Promise<Match[] | ErrorReturnType> {
    return await this.matchService.getTodayMatch({ date, leagueId });
  }

  @Get('all/:leagueId')
  async getAllMatch(
    @Param('leagueId') leagueId: number,
  ): Promise<AllMatchPerSeason | ErrorReturnType> {
    return await this.matchService.getAllMatch(leagueId);
  }

  @Post('vote')
  @UseGuards(JwtAuthGuard)
  async voteMatch(@Body() vote: Vote): Promise<VoteType | ErrorReturnType> {
    return await this.matchService.voteMatch(vote);
  }
}
