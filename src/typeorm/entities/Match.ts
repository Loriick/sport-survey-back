import { Team } from 'src/types/leagues';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ nullable: true })
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

  @OneToMany(() => Vote, (vote) => vote.match)
  vote: Vote[];
}
