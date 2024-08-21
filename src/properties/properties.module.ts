import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyPhotos } from './entities/property-photos.entity';

@Module({
  providers: [PropertiesService],
  controllers: [PropertiesController],
  imports: [TypeOrmModule.forFeature([Property, PropertyPhotos])],
})
export class PropertiesModule {}
