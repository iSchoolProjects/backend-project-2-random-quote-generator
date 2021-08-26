import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'category' })
@Unique(['title'])
export class Category {
  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 40 })
  title: string;

  @ManyToOne(() => Category)
  parent: Category;
}
