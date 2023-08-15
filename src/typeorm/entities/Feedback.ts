import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  feedback: string;

  @Column({ nullable: true })
  email: string;
}
