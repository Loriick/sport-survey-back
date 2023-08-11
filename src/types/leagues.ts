export interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
  country: string;
  countryCode: string;
  flag: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Stadium {
  id: number;
  city: string;
  name: string;
}

export interface Match {
  id: number;
  date: Date | string;
  timestamp: number;
  referee: string;
  leagueId: number;
  stadium: Stadium;
  day: number;
  teams: {
    home: Team & {
      winner: boolean | null;
    };
    away: Team & {
      winner: boolean | null;
    };
  };
}

export interface AllMatchPerSeason {
  [k: number]: Match[];
}
