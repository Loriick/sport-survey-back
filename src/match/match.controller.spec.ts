import { TestingModule, Test } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { AllMatchPerSeason, League, Match } from '../../src/types/leagues';

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
    apiId: 1044885,
    date: '2023-08-11',
    timestamp: 1691780400,
    referee: 'B. Bastien',
    leagueId: 61,
    day: 1,
    stadium: 'Allianz Riviera - Nice',
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
      apiId: 1044885,
      date: '2023-08-11',
      timestamp: 1691780400,
      referee: 'B. Bastien',
      leagueId: 61,
      day: 1,
      stadium: 'Allianz Riviera - Nice',
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
  let matchController;
  let matchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchService],
      controllers: [MatchController],
    }).compile();

    matchService = module.get<MatchService>(MatchService);
    matchController = module.get<MatchController>(MatchController);
  });

  describe('Games', () => {
    it('controller and service should be defined', () => {
      expect(matchController).toBeDefined();
      expect(matchService).toBeDefined();
    });

    it('should return Leagues', async () => {
      jest
        .spyOn(matchService, 'getLeagues')
        .mockImplementation(async () => leagues);

      expect(await matchService.getLeagues()).toEqual(leagues);
    });
  });

  it('should return All games of the day', async () => {
    jest
      .spyOn(matchService, 'getTodayMatch')
      .mockImplementation(async () => matches);

    expect(await matchController.getTodayMatch()).toEqual(matches);
  });

  it('should return All games for the current season', async () => {
    jest
      .spyOn(matchService, 'getAllMatch')
      .mockImplementation(async () => matchPerSeason);

    expect(await matchController.getAllMatch(61)).toEqual(matchPerSeason);
  });
});
