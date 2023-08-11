import { Injectable } from '@nestjs/common';
import { AllMatchPerSeason, League, Match } from 'src/types/leagues';
import { countries, leagueList, today } from 'src/utils/constants';
import { callFootballAPI, createMatch } from 'src/utils/games';

@Injectable()
export class LeaguesService {
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

  async getTodayMatch(): Promise<Match[]> {
    try {
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

      const matchOfTheDay: Match[] = responses.flatMap((match) => {
        return createMatch(match.response);
      });
      return matchOfTheDay;
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

      const matchList = createMatch(data.response);

      const matchPerDay: AllMatchPerSeason = matchList.reduce(
        (seasonObject, currentMatch: Match) => {
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
