export const countries = [
  'France',
  'England',
  'Italy',
  'Spain',
  'Germany',
  'World',
] as const;
export const leagueList = [
  'Ligue 1',
  'Premier League',
  'La Liga',
  'Serie A',
  'Bundesliga',
  'UEFA Champions League',
  'UEFA Europa League',
  'UEFA Europa Conference League',
] as const;

export const today = new Date().toISOString().split('T')[0];
export const AUTH_SERVICE = 'AUTH_SERVICE';
export const BASE_API_URL = 'https://api-football-v1.p.rapidapi.com/v3';
