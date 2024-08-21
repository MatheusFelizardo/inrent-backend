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
import { PropertyPhotos } from './property-photos.entity';
import { Labels } from './labels.entity';

@Entity()
export class PhotoLabels {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => PropertyPhotos,
    (propertyPhoto) => propertyPhoto.photoLabels,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'propertyPhotoId' })
  propertyPhoto: PropertyPhotos;

  @Column()
  propertyPhotoId: number;

  @ManyToOne(() => Labels, (label) => label.photoLabels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'labelId' })
  label: Labels;

  @Column()
  labelId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
