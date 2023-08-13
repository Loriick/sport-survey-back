import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match, Vote } from 'src/typeorm/entities';
import {
  AllMatchPerSeason,
  League,
  Match as MatchType,
} from 'src/types/leagues';
import { countries, leagueList, today } from 'src/utils/constants';
import { callFootballAPI, createMatch, createMatchList } from 'src/utils/games';
import { Repository } from 'typeorm';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
  ) {}
  async getLeagues(): Promise<League[]> {
    try {
      const response = await callFootballAPI({ pathname: 'leagues' });

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

      return leagues;
    } catch (error) {
      console.error(error);
    }
  }

  async getTodayMatch(): Promise<MatchType[]> {
    try {
      const matchOfTheDay = await this.matchRepository.find({
        relations: ['vote'],
        where: {
          date: today,
        },
        order: {
          id: 'ASC',
        },
      });

      if (matchOfTheDay.length > 0) return matchOfTheDay;

      const leagues = await this.getLeagues();
      const leaguesIds = leagues.map((league) => league.id);

      const responses = await Promise.all(
        leaguesIds.map((id) =>
          callFootballAPI({
            pathname: 'fixtures?',
            params: new URLSearchParams({
              date: today,
              league: id.toString(),
              season: new Date().getFullYear().toString(),
            }),
          }).then((data) => (data as Response).json()),
        ),
      );

      const createdMatch = responses.flatMap((match) => {
        return match.response.map(
          (game: { fixture: unknown; league: unknown; teams: unknown }) => {
            const newMatch = createMatch(game);
            const newMatchCreated = this.matchRepository.create(newMatch);

            return this.matchRepository.save(newMatchCreated);
          },
        );
      });

      return createdMatch;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllMatch(leagueId: number): Promise<AllMatchPerSeason> {
    if (!leagueId) {
      throw new Error('Id of the league is not provided');
    }
    try {
      const response = await callFootballAPI({
        pathname: 'fixtures?',
        params: new URLSearchParams({
          league: leagueId.toString(),
          season: new Date().getFullYear().toString(),
        }),
      });
      const data = await (response as Response).json();

      const matchList = createMatchList(data.response);

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
  async voteMatch(vote: Vote) {
    const createdVote = this.voteRepository.create(vote);
    await this.voteRepository.save(createdVote);

    const match = await this.matchRepository.findOneBy({ id: vote.gameId });
    match.vote && match.vote?.length > 1
      ? match.vote.push(createdVote)
      : (match.vote = [createdVote]);

    await this.matchRepository.save(match);

    return createdVote;
  }
}
