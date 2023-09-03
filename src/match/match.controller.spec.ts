import { TestingModule, Test } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import {
  AllMatchPerSeason,
  League,
  MatchReturnType,
} from '../../src/types/game';
import { Match, Team, Vote } from '../typeorm/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtAuthService } from '../auth/jwt/jwt.service';
import { JwtService } from '@nestjs/jwt';

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

const matches: MatchReturnType[] = [
  {
    apiId: 1044885,
    date: '2023-08-11',
    timestamp: 1691780400,
    referee: 'B. Bastien',
    leagueId: 61,
    leagueName: 'Ligue 1',
    day: 1,
    stadium: 'Allianz Riviera - Nice',
    teams: {
      home: {
        providerId: 84,
        name: 'Nice',
        logo: 'https://media-3.api-sports.io/football/teams/84.png',
      },
      away: {
        providerId: 79,
        name: 'Lille',
        logo: 'https://media-3.api-sports.io/football/teams/79.png',
      },
    },
    vote: [
      { id: 1, gameId: 1, vote: 'Nice', userId: 1 },
      { id: 3, gameId: 1, vote: 'Lille', userId: 3 },
      { id: 4, gameId: 1, vote: 'Draw', userId: 4 },
    ],
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
      leagueName: 'Ligue 1',
      day: 1,
      stadium: 'Allianz Riviera - Nice',
      teams: {
        home: {
          providerId: 84,
          name: 'Nice',
          logo: 'https://media-3.api-sports.io/football/teams/84.png',
        },
        away: {
          providerId: 79,
          name: 'Lille',
          logo: 'https://media-3.api-sports.io/football/teams/79.png',
        },
      },
    },
  ],
};

const voteResults = {
  nice: { count: 2, percentage: 50 },
  lille: { count: 1, percentage: 25 },
  draw: { count: 1, percentage: 25 },
};

describe('AppController', () => {
  let matchController: MatchController;
  let matchService: MatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        JwtAuthService,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Match),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            findBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Vote),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Team),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findBy: jest.fn(),
          },
        },
      ],
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

    expect(await matchController.getTodayMatch('2023-08-11')).toEqual(matches);
  });

  it('should return All games for the current season', async () => {
    jest
      .spyOn(matchService, 'getAllMatch')
      .mockImplementation(async () => matchPerSeason);

    expect(await matchController.getAllMatch(61)).toEqual(matchPerSeason);
  });

  it('should return vote result', async () => {
    jest
      .spyOn(matchService, 'voteMatch')
      .mockImplementation(async () => voteResults);

    expect(
      await matchController.voteMatch({
        userId: 2,
        gameId: 1,
        vote: 'Nice',
      }),
    ).toEqual(voteResults);
  });
});
