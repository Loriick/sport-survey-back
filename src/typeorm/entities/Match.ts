import { Team } from 'src/types/leagues';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Vote } from './MatchVote';

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

  @Column()
  referee: string;

  @Column('int')
  leagueId: number;

  @Column()
  stadium: string;

  @Column('int')
  day: number;

  @Column('json')
  teams: {
    home: Team & {
      winner: boolean | null;
    };
    away: Team & {
      winner: boolean | null;
    };
  };

  @OneToOne(() => Vote)
  @JoinColumn()
  vote: Vote;
}
