import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

// Entities
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import { PropertyPhotos } from '../properties/entities/property-photos.entity';
import { Profile } from '../users/entities/profile.entity';
import { Labels } from '../properties/entities/labels.entity';
import { PhotoLabels } from '../properties/entities/photo-labels.entity';

config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Profile, Property, PropertyPhotos, Labels, PhotoLabels],
  synchronize: true,
};
