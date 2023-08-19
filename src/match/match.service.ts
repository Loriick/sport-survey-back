import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, Vote } from '../typeorm/entities';
import {
  AllMatchPerSeason,
  League,
  Match as MatchType,
  Vote as VoteType,
} from 'src/types/leagues';
import {
  BASE_API_URL,
  countries,
  errorMessage,
  leagueList,
  today,
} from '../utils/constants';
import { Repository } from 'typeorm';
import { ErrorReturnType } from 'src/types/error';
import { Like } from 'typeorm';
import { CreateTeamDto } from 'src/team/dto/create-team.dto';
import { Team } from 'src/typeorm/entities/Team';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
  ) {}
  async getLeagues(): Promise<League[] | ErrorReturnType> {
    try {
      const response = await this.callFootballAPI({ pathname: 'leagues' });

      const data = await (response as Response).json();

      const countriesLeagues = data.response.filter((league) =>
        countries.includes(league.country?.name),
      );
      const filterredLeagues = countriesLeagues.filter((league) =>
        leagueList.includes(league.league.name),
      );

      const leagues = filterredLeagues.map(({ league, country }) => ({
        id: league.id,
        name: league.name,
        type: league.type,
        logo: league.logo,
        country: country.name,
        countryCode: country.code,
        flag: country.flag,
      }));

      if (!leagues) {
        throw new NotFoundException();
      }

      return leagues;
    } catch (error) {
      return {
        message: errorMessage,
      };
    }
  }

  async getTodayMatch({ date, leagueId }): Promise<any[] | ErrorReturnType> {
    try {
      const matchOfTheDay = await this.matchRepository.find({
        relations: ['vote'],
        where: {
          date: Like(`%${date}%`),
          apiId: leagueId ? leagueId : undefined,
        },
        order: {
          timestamp: 'ASC',
        },
      });
      if (matchOfTheDay.length > 0) return matchOfTheDay;

      const leagues = await this.getLeagues();
      const leaguesIds = (leagues as League[]).map((league) => league.id);

      const responses = await Promise.all(
        leaguesIds.map((id) =>
          this.callFootballAPI({
            pathname: 'fixtures?',
            params: new URLSearchParams({
              date: today,
              league: id.toString(),
              season: new Date().getFullYear().toString(),
            }),
          }).then((data) => (data as Response).json()),
        ),
      );

      const createdMatch: Match[] = [];

      for (const match of responses) {
        for (const game of match.response) {
          const { home, away } = game.teams;
          const homeTeam = await this.createTeam({
            providerId: home.id,
            name: home.name,
            logo: home.logo,
          });

          const awayTeam = await this.createTeam({
            providerId: away.id,
            name: away.name,
            logo: away.logo,
          });

          const newMatch = this.createMatch(game);
          newMatch.homeTeam = homeTeam;
          newMatch.awayTeam = awayTeam;
          const newMatchCreated = this.matchRepository.create(newMatch);
          const savedMatch = await this.matchRepository.save(newMatchCreated);
          createdMatch.push(savedMatch);
        }
      }

      return createdMatch;
    } catch (error) {
      console.log(error);
      return {
        message: errorMessage,
      };
    }
  }

  async getAllMatch(leagueId: number): Promise<AllMatchPerSeason> {
    if (!leagueId) {
      throw new Error('Id of the league is not provided');
    }
    try {
      const response = await this.callFootballAPI({
        pathname: 'fixtures?',
        params: new URLSearchParams({
          league: leagueId.toString(),
          season: new Date().getFullYear().toString(),
        }),
      });
      const data = await (response as Response).json();

      const matchList = this.createMatchList(data.response);

      const matchPerDay: AllMatchPerSeason = matchList.reduce(
        (seasonObject, currentMatch: MatchType) => {
          if (seasonObject[currentMatch.day]) {
            seasonObject[currentMatch.day].push(currentMatch);
            return seasonObject;
          }
          seasonObject[currentMatch.day] = [currentMatch];
          return seasonObject;
        },
        {},
      );

      return matchPerDay;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async voteMatch(vote: VoteType) {
    try {
      const createdVote = this.voteRepository.create(vote);
      await this.voteRepository.save(createdVote);

      const match = await this.matchRepository.findOneBy({ id: vote.gameId });
      match.vote && match.vote?.length > 1
        ? match.vote.push(createdVote)
        : (match.vote = [createdVote]);

      await this.matchRepository.save(match);

      return createdVote;
    } catch (error) {
      return {
        message: errorMessage,
      };
    }
  }

  private async callFootballAPI({
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

  private createMatchList(array: unknown[]): MatchType[] {
    return array.map(this.createMatch);
  }

  private createMatch({ fixture, league }): MatchType {
    return {
      apiId: fixture.id,
      date: fixture.date,
      timestamp: fixture.timestamp,
      referee: fixture.referee,
      leagueId: league.id,
      day: +league.round.replace(/[A-Za-z$-]/g, ''),
      stadium: `${fixture.venue.name} - ${fixture.venue.city}`,
    };
  }

  private createTeam(createTeamdto: CreateTeamDto) {
    try {
      const createdTeam = this.teamRepository.create(createTeamdto);
      return this.teamRepository.save(createdTeam);
    } catch (error) {
      console.error(error);
    }
  }

  private async findTeam(providerId: number) {
    try {
      const team = await this.teamRepository.findBy({
        providerId,
      });
      if (!team) {
        throw new NotFoundException();
      }
      return team;
    } catch (error) {
      console.error(error);
    }
  }
}
