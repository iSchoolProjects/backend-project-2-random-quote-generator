import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Slug {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column()
  slug: string;

  @Column({ type: 'int', unsigned: true, default: 1 })
  count: number;
}
