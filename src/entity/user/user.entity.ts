import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from '../../enum/user-role.enum';
import { Exclude } from 'class-transformer';
import { Quote } from '../quote/quote.entity';
import { UserPhoto } from '../user-photo/user-photo.entity';

@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Quote, (quote) => quote.createdBy)
  quotes: Quote[];

  @OneToOne(() => UserPhoto)
  @JoinColumn()
  profilePhoto: UserPhoto;

  @Column({ default: 0 })
  passwordChangeCounter: number;

  @Column({ default: true })
  isEnabled: boolean;
}
