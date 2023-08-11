import { Match } from 'src/types/leagues';

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
