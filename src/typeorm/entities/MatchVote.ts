import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'votes' })
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  matchId: number;

  @Column()
  userId: number;

  @Column()
  voteCount: number;

  @Column()
  vote: string;
}
