import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vote } from './MatchVote';
import { Team } from './Team';

@Entity({ name: 'match' })
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  apiId: number;

  @Column()
  date: string;

  @Column('int')
  timestamp: number;

  @Column({ nullable: true })
  referee: string;

  @Column('int')
  leagueId: number;

  @Column()
  stadium: string;

  @Column('int')
  day: number;

  @OneToMany(() => Vote, (vote) => vote.match)
  vote: Vote[];

  @OneToOne(() => Team)
  @JoinColumn()
  homeTeam: Team;

  @OneToOne(() => Team)
  @JoinColumn()
  awayTeam: Team;
}
