import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class UserPhoto {
  constructor(partial: Partial<UserPhoto>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photo: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: null })
  profilePhoto: number;
}
