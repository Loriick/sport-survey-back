import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../typeorm/entities/Team';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
  ) {}
  createTeam(createTeamdto: CreateTeamDto) {
    try {
      const createdTeam = this.teamRepository.create(createTeamdto);
      return this.teamRepository.save(createdTeam);
    } catch (error) {
      console.error(error);
    }
  }

  async findTeam(providerId: number) {
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
