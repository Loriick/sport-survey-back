import { Injectable } from '@nestjs/common';
import { AllMatchPerSeason, League, Match } from 'src/types/leagues';
import { createMatch } from 'src/utils/games';

const countries = ['France', 'England', 'Italy', 'Spain', 'Germany'];
const leagueList = [
  'Ligue 1',
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
];
const today = new Date().toISOString().split('T')[0];
const BASE_API_URL = 'https://api-football-v1.p.rapidapi.com/v3';

@Injectable()
export class LeaguesService {
  async getLeagues(): Promise<League[]> {
    try {
      const response = await fetch(`${BASE_API_URL}/leagues`, {
        headers: {
          'X-RapidAPI-Key':
            'fae0ca8846msh64a9e63faa98a6cp18ba15jsn059caa14bc8b',
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        },
      });

      const data = await response.json();

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
          fetch(
            `${BASE_API_URL}/fixtures?` +
              new URLSearchParams({
                date: today,
                league: id.toString(),
                season: new Date().getFullYear().toString(),
              }),
            {
              headers: {
                'X-RapidAPI-Key':
                  'fae0ca8846msh64a9e63faa98a6cp18ba15jsn059caa14bc8b',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
              },
            },
          ).then((data) => data.json()),
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
      const response = await fetch(
        `${BASE_API_URL}/fixtures?` +
          new URLSearchParams({
            league: leagueId.toString(),
            season: new Date().getFullYear().toString(),
          }),
        {
          headers: {
            'X-RapidAPI-Key':
              'fae0ca8846msh64a9e63faa98a6cp18ba15jsn059caa14bc8b',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
          },
        },
      );
      const data = await response.json();

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
