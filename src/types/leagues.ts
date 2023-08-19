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
  apiId: number;
  date: string;
  timestamp: number;
  referee: string;
  leagueId: number;
  stadium: string;
  day: number;
  homeTeam?: Team;
  awayTeam?: Team;

  // TODO: change this type
  vote?: any;
}

export interface AllMatchPerSeason {
  [k: number]: Match[];
}

export interface Vote {
  id: number;

  userId: number;

  voteCount: number;

  votes: {
    away: number | null;
    home: number | null;
    draw: number | null;
  };

  gameId: number;

  match: Match;
}
