import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, Vote } from '../typeorm/entities';
import {
  AllMatchPerSeason,
  League,
  MatchReturnType,
  Match as MatchType,
  Vote as VoteType,
} from 'src/types/game';
import {
  BASE_API_URL,
  countries,
  errorMessage,
  leagueList,
} from '../utils/constants';
import { Repository } from 'typeorm';
import { ErrorReturnType } from 'src/types/error';
import { Like } from 'typeorm';
import { CreateTeamDto } from '../team/dto/create-team.dto';
import { Team } from '../typeorm/entities/Team';

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
      console.error('THERE WAS A ERROR', error);
      return {
        message: errorMessage,
      };
    }
  }

  async getTodayMatch({
    date,
    leagueId,
  }): Promise<MatchReturnType[] | ErrorReturnType> {
    try {
      console.log('PRODUCTION DATE', date);
      const matchOfTheDay = await this.matchRepository.find({
        relations: ['vote', 'homeTeam', 'awayTeam'],
        where: {
          date: Like(`%${date}%`),
          apiId: leagueId ? leagueId : undefined,
        },
        order: {
          timestamp: 'ASC',
        },
      });

      console.log('MATCH OF THE DAY', matchOfTheDay);

      console.log(
        'IS THERE MATCH OF THE DAY IN THE DATABASE',
        matchOfTheDay.length > 0,
      );
      if (matchOfTheDay.length > 0)
        return matchOfTheDay.map((match) => this.makeMatchApiResponse(match));

      console.log('START CREATE MATCH OF DAY LIST...');
      const leagues = await this.getLeagues();
      const leaguesIds = (leagues as League[]).map((league) => league.id);

      const responses = await Promise.all(
        leaguesIds.map((id) =>
          this.callFootballAPI({
            pathname: 'fixtures?',
            params: new URLSearchParams({
              date: date,
              league: id.toString(),
              season: new Date().getFullYear().toString(),
            }),
          }).then((data) => (data as Response).json()),
        ),
      );

      const createdMatch: MatchReturnType[] = [];

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
          createdMatch.push(this.makeMatchApiResponse(savedMatch));
        }
      }
      console.log('MATCH LIST CREATED WITH ', createdMatch.length + ' CREATED');
      return createdMatch;
    } catch (error) {
      console.error('THERE WAS A ERROR', error);
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

      if (!match) {
        throw new Error('Match not found');
      }

      match.vote && match.vote?.length > 1
        ? match.vote.push(createdVote)
        : (match.vote = [createdVote]);

      await this.matchRepository.save(match);

      return this.getVoteResult(match.vote);
    } catch (error) {
      console.error(error);
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
      leagueName: league.name,
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

  private makeMatchApiResponse(match: MatchType): MatchReturnType {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { awayTeam, homeTeam, ...rest } = match;
    return {
      ...rest,
      teams: {
        home: match.homeTeam,
        away: match.awayTeam,
      },
    };
  }

  async findMatchById(id: number): Promise<MatchType> {
    try {
      const match = await this.matchRepository.findOneBy({
        id,
      });
      return match;
    } catch (error) {
      console.log(error);
    }
  }

  getVoteResult(votes: MatchType['vote']) {
    const totalCount = votes.length;
    return votes.reduce((results, { vote }) => {
      const cleanedVote = vote.toLowerCase();

      results[cleanedVote] = results[cleanedVote] || {
        count: 0,
        percentage: 0,
      };
      results[cleanedVote].count++;
      results[cleanedVote].percentage = (
        (results[cleanedVote].count / totalCount) *
        100
      ).toFixed(2);

      return results;
    }, {});
  }
}
