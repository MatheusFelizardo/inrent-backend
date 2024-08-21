import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyPhotos } from './entities/property-photos.entity';
import { Labels } from './entities/labels.entity';
import { PhotoLabels } from './entities/photo-labels.entity';

@Module({
  providers: [PropertiesService],
  controllers: [PropertiesController],
  imports: [
    TypeOrmModule.forFeature([Property, PropertyPhotos, Labels, PhotoLabels]),
  ],
})
export class PropertiesModule {}
