import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private PropertysRepository: Repository<Property>,
  ) {}
}
