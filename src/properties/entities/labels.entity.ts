import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PhotoLabels } from './photo-labels.entity';
@Entity()
export class Labels {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PhotoLabels, (photoLabels) => photoLabels.label)
  photoLabels: PhotoLabels[];
}
