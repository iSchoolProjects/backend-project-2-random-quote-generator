import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'quote' })
export class Quote {
  constructor(partial: Partial<Quote>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  author: string;

  @ManyToOne(() => Category)
  category: Category;

  @Column({ type: 'tinyint', default: 0 })
  isDeleted: boolean;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({ default: '' })
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
