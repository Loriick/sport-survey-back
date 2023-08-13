import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from './Match';

@Entity({ name: 'votes' })
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  voteCount: number;

  @Column('simple-json')
  votes: {
    away: number | null;
    home: number | null;
    draw: number | null;
  };

  @Column()
  gameId: number;

  @ManyToOne(() => Match, (match) => match.vote, { onDelete: 'SET NULL' })
  match: Match;
}
