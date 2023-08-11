import { Match } from 'src/types/leagues';
import { URLSearchParams } from 'url';

const BASE_API_URL = 'https://api-football-v1.p.rapidapi.com/v3';

export function createMatch(array: unknown[]): Match[] {
  return array.map(({ fixture, league, teams }) => ({
    id: fixture.id,
    date: fixture.date,
    timestamp: fixture.timestamp,
    referee: fixture.referee,
    leagueId: league.id,
    day: +league.round.replace(/[A-Za-z$-]/g, ''),
    stadium: {
      id: fixture.venue.id,
      name: fixture.venue.name,
      city: fixture.venue.city,
    },
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
  }));
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
