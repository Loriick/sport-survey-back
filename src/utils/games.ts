import { Match } from 'src/types/leagues';
import { URLSearchParams } from 'url';
import { BASE_API_URL } from './constants';

export function createMatchList(array: unknown[]): Match[] {
  return array.map(createMatch);
}

export function createMatch({ fixture, league, teams }): Match {
  return {
    apiId: fixture.id,
    date: fixture.date.split('T')[0],
    timestamp: fixture.timestamp,
    referee: fixture.referee,
    leagueId: league.id,
    day: +league.round.replace(/[A-Za-z$-]/g, ''),
    stadium: `${fixture.venue.name} - ${fixture.venue.city}`,

    teams: {
      home: {
        id: teams.home.id,
        name: teams.home.name,
        logo: teams.home.logo,
        winner: teams.home.winner,
      },
      away: {
        id: teams.away.id,
        name: teams.away.name,
        logo: teams.away.logo,
        winner: teams.away.winner,
      },
    },
  };
}

export async function callFootballAPI({
  pathname,
  params,
}: {
  pathname: string;
  params?: URLSearchParams;
}): Promise<Response | Response[]> {
  const extra = params ? params : '';
  return await fetch(`${BASE_API_URL}/${pathname}` + extra, {
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    },
  });
}
