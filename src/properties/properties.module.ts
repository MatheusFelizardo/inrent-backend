import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { Property } from './entities/property.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [PropertiesService],
  controllers: [PropertiesController],
  imports: [TypeOrmModule.forFeature([Property])],
})
export class PropertiesModule {}
