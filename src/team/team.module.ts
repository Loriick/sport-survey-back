import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from 'src/typeorm/entities/Team';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Team])],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
