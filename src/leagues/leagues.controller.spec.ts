import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';
import { AllMatchPerSeason, League, Match } from 'src/types/leagues';

const leagues: League[] = [
  {
    id: 61,
    name: 'Ligue 1',
    type: 'League',
    logo: 'https://media-2.api-sports.io/football/leagues/61.png',
    country: 'France',
    countryCode: 'FR',
    flag: 'https://media-3.api-sports.io/flags/fr.svg',
  },
];

const matches: Match[] = [
  {
    id: 1044885,
    date: '2023-08-11T19:00:00+00:00',
    timestamp: 1691780400,
    referee: 'B. Bastien',
    leagueId: 61,
    day: 1,
    stadium: {
      id: 663,
      name: 'Allianz Riviera',
      city: 'Nice',
    },
    teams: {
      home: {
        id: 84,
        name: 'Nice',
        logo: 'https://media-3.api-sports.io/football/teams/84.png',
        winner: null,
      },
      away: {
        id: 79,
        name: 'Lille',
        logo: 'https://media-3.api-sports.io/football/teams/79.png',
        winner: null,
      },
    },
  },
];
const matchPerSeason: AllMatchPerSeason = {
  1: [
    {
      id: 1044885,
      date: '2023-08-11T19:00:00+00:00',
      timestamp: 1691780400,
      referee: 'B. Bastien',
      leagueId: 61,
      day: 1,
      stadium: {
        id: 663,
        name: 'Allianz Riviera',
        city: 'Nice',
      },
      teams: {
        home: {
          id: 84,
          name: 'Nice',
          logo: 'https://media-3.api-sports.io/football/teams/84.png',
          winner: null,
        },
        away: {
          id: 79,
          name: 'Lille',
          logo: 'https://media-3.api-sports.io/football/teams/79.png',
          winner: null,
        },
      },
    },
  ],
};

describe('AppController', () => {
  let leaguesController: LeaguesController;
  let leaguesService: LeaguesService;

  beforeEach(() => {
    leaguesService = new LeaguesService();
    leaguesController = new LeaguesController(leaguesService);
  });

  describe('root', () => {
    it('should return Leagues', async () => {
      jest
        .spyOn(leaguesService, 'getLeagues')
        .mockImplementation(async () => leagues);

      expect(await leaguesController.getLeagues()).toEqual(leagues);
    });
  });

  it('should return All games of the day', async () => {
    jest
      .spyOn(leaguesService, 'getTodayMatch')
      .mockImplementation(async () => matches);

    expect(await leaguesController.getTodayMatch()).toEqual(matches);
  });

  it('should return All games for the current season', async () => {
    jest
      .spyOn(leaguesService, 'getAllMatch')
      .mockImplementation(async () => matchPerSeason);

    expect(await leaguesController.getAllMatch(61)).toEqual(matches);
  });
});
