import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from '../typeorm/entities';
import { Repository } from 'typeorm';

const team = {
  id: 1,
  providerId: 1234,
  name: "nom de l'équipe",
  logo: "logo de l'équipe",
};

describe('TeamService', () => {
  let service: TeamService;
  let repository: Repository<Team>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: { create: jest.fn(), save: jest.fn(), findBy: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    repository = module.get<Repository<Team>>(getRepositoryToken(Team));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should create a team', async () => {
    const teamToCreate = {
      providerId: 1234,
      name: "nom de l'équipe",
      logo: "logo de l'équipe",
    };
    await service.createTeam(teamToCreate);
    expect(repository.create).toHaveBeenCalledWith(teamToCreate);
    expect(repository.create);
  });
  it('should find a team', async () => {
    await service.findTeam(team.providerId);
    expect(repository.findBy).toHaveBeenCalledWith({ providerId: 1234 });
    expect(repository.findBy);
  });
});
