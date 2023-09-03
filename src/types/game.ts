export interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: string;
  countryCode: string;
  flag: string;
}

export interface Team {
  providerId: number;
  name: string;
  logo: string;
}

export interface Match {
  id?: number;
  apiId: number;
  date: string;
  timestamp: number;
  referee: string;
  leagueId: number;
  leagueName: string;
  stadium: string;
  day: number;
  homeTeam?: Team;
  awayTeam?: Team;

  vote?: Vote[];
}

export interface MatchReturnType extends Omit<Match, 'homeTeam' | 'awayTeam'> {
  teams: {
    home: Team;
    away: Team;
  };
}

export interface AllMatchPerSeason {
  [k: number]: MatchReturnType[];
}

export interface Vote {
  id?: number;
  userId: number;
  vote: string;
  gameId: number;
}
