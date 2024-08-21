import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';

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
}
