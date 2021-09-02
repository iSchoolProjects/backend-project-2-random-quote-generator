import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRole } from '../../enum/user-role.enum';
import { Exclude } from 'class-transformer';
import { Quote } from '../quote/quote.entity';
import { UserPhoto } from '../user-photo/user-photo.entity';

@Entity()
@Unique(['username', 'email'])
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column()
  salt: string;

  @Column({ default: 'user' })
  role: UserRole;

  @OneToMany(() => Quote, (quote) => quote.createdBy)
  quotes: Quote[];

  @OneToOne(() => UserPhoto)
  @JoinColumn()
  profilePhoto: UserPhoto;

  // toJSON() {
  //   delete this.password;
  //   delete this.salt;
  //   return this;
  // }
}
