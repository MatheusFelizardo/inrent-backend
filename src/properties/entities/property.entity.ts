import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PropertyPhotos } from './property-photos.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.properties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ default: '' })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['house', 'apartment', 'office', 'land', 'commercial', 'other'],
  })
  type: string;

  @Column({
    type: 'enum',
    enum: ['for_sale', 'for_rent', 'sold', 'rented'],
    default: 'for_rent',
  })
  status: string;

  @Column({ nullable: true })
  bedrooms: number;

  @Column({ nullable: true })
  bathrooms: number;

  @Column()
  parking: number;

  @Column({ nullable: true })
  area: number;

  @Column()
  furnished: boolean;

  @Column({ nullable: true })
  acceptAnimals: boolean;

  @Column()
  fullAddress: string;

  @Column({ nullable: true })
  addressComplement: string;

  @Column()
  addressNumber: number;

  @Column()
  city: string;

  @Column()
  zipcode: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  latitude: string;

  @Column('decimal')
  price: number;

  @Column()
  available: boolean;

  @Column({ default: false })
  featured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => PropertyPhotos, (propertyPhotos) => propertyPhotos.property)
  photos: PropertyPhotos[];
}
