import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  displayName: string;

  @Column()
  picturePath: string;

  @Column()
  username: string;

  @Column()
  provider: string;

  @Column()
  providerId: string;
}
