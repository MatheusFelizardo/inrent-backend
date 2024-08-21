import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Property } from './property.entity';
import { Labels } from './labels.entity';
import { PhotoLabels } from './photo-labels.entity';

@Entity()
export class PropertyPhotos {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Property, (property) => property.photos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column()
  propertyId: number;

  @Column()
  photoUrl: string;

  @Column()
  description: string;

  @Column({ default: true })
  showInGallery: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PhotoLabels, (photoLabels) => photoLabels.propertyPhoto)
  photoLabels: PhotoLabels[];
}
