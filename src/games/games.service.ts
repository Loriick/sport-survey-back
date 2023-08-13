import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/typeorm/entities';
import {
  AllMatchPerSeason,
  League,
  Match as MatchType,
} from 'src/types/leagues';
import { countries, leagueList, today } from 'src/utils/constants';
import { callFootballAPI, createMatch, createMatchList } from 'src/utils/games';
import { Repository } from 'typeorm';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}
  async getLeagues(): Promise<League[]> {
    try {
      const response = await callFootballAPI({ pathname: 'leagues' });

      const data = await (response as Response).json();

      const countriesLeagues = data.response.filter((league) =>
        countries.includes(league.country?.name),
      );
      const filterredLeagues = countriesLeagues.filter((league) =>
        leagueList.includes(league.league.name),
      );

      const leagues = filterredLeagues.map(({ league, country }) => ({
        id: league.id,
        name: league.name,
        type: league.type,
        logo: league.logo,
        country: country.name,
        countryCode: country.code,
        flag: country.flag,
      }));

      return leagues;
    } catch (error) {
      console.error(error);
    }
  }

  async getTodayMatch(): Promise<MatchType[]> {
    try {
      const matchOfTheDay = await this.matchRepository.findBy({
        date: today,
      });

      if (matchOfTheDay.length > 0) return matchOfTheDay;

      const leagues = await this.getLeagues();
      const leaguesIds = leagues.map((league) => league.id);

      const responses = await Promise.all(
        leaguesIds.map((id) =>
          callFootballAPI({
            pathname: 'fixtures?',
            params: new URLSearchParams({
              date: today,
              league: id.toString(),
              season: new Date().getFullYear().toString(),
            }),
          }).then((data) => (data as Response).json()),
        ),
      );

      const createdMatch = responses.flatMap((match) => {
        return match.response.map(
          async (game: {
            fixture: unknown;
            league: unknown;
            teams: unknown;
          }) => {
            const newMatch = createMatch(game);
            const newMatchCreated = this.matchRepository.create(newMatch);
            this.matchRepository.save(newMatchCreated);
            return newMatchCreated;
          },
        );
      });

      return createdMatch;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllMatch(leagueId: number): Promise<AllMatchPerSeason> {
    if (!leagueId) {
      throw new Error('Id of the league is not provided');
    }
    try {
      const response = await callFootballAPI({
        pathname: 'fixtures?',
        params: new URLSearchParams({
          league: leagueId.toString(),
          season: new Date().getFullYear().toString(),
        }),
      });
      const data = await (response as Response).json();

      const matchList = createMatchList(data.response);

      const matchPerDay: AllMatchPerSeason = matchList.reduce(
        (seasonObject, currentMatch: MatchType) => {
          if (seasonObject[currentMatch.day]) {
            seasonObject[currentMatch.day].push(currentMatch);
            return seasonObject;
          }
          seasonObject[currentMatch.day] = [currentMatch];
          return seasonObject;
        },
        {},
      );

      return matchPerDay;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
