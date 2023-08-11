import { Controller, Get, Param } from '@nestjs/common';
import { LeaguesService } from './leagues.service';
import { AllMatchPerSeason, League, Match } from 'src/types/leagues';

@Controller('/game')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get('/leagues')
  async getLeagues(): Promise<League[]> {
    return await this.leaguesService.getLeagues();
  }
  @Get('/of-the-day')
  async getTodayMatch(): Promise<Match[]> {
    return await this.leaguesService.getTodayMatch();
  }
  @Get('/all/:leagueId')
  async getAllMatch(
    @Param('leagueId') leagueId: number,
  ): Promise<AllMatchPerSeason> {
    return await this.leaguesService.getAllMatch(leagueId);
  }
}
