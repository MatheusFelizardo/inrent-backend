import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { IResponse } from 'src/types';
import { CreatePropertyDto, PropertyResponseDto } from './dto/property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async findAll(): Promise<IResponse<PropertyResponseDto[]>> {
    try {
      const properties = await this.propertyRepository.find();

      if (properties.length === 0) {
        return { error: false, message: 'No properties found', data: null };
      }

      const propertiesDto = properties.map((property) => {
        return new PropertyResponseDto(property);
      });

      return { error: false, message: 'Properties found', data: propertiesDto };
    } catch (error) {
      console.error(error.message);
      return {
        error: true,
        message: 'Some error ocurred while getting the property list',
        data: null,
      };
    }
  }

  async create(
    createPropertyDto: CreatePropertyDto,
  ): Promise<IResponse<PropertyResponseDto>> {
    try {
      const property = this.propertyRepository.create(createPropertyDto);

      const savedProperty = await this.propertyRepository.save(property);
      property.slug = this.generateSlug(savedProperty);
      const updatedProperty = await this.propertyRepository.save(property);

      return {
        error: false,
        message: 'Property created',
        data: new PropertyResponseDto(updatedProperty),
      };
    } catch (error) {
      console.error(error.message);
      return {
        error: true,
        message: 'Some error ocurred while creating the property',
        data: null,
      };
    }
  }

  async update(
    id: number,
    createPropertyDto: CreatePropertyDto,
  ): Promise<IResponse<PropertyResponseDto>> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
      });

      if (!property) {
        return { error: true, message: 'Property not found', data: null };
      }

      const updatedProperty = await this.propertyRepository.save({
        ...property,
        ...createPropertyDto,
      });

      return {
        error: false,
        message: 'Property updated',
        data: new PropertyResponseDto(updatedProperty),
      };
    } catch (error) {
      console.error(error.message);
      return {
        error: true,
        message: 'Some error ocurred while updating the property',
        data: null,
      };
    }
  }

  async delete(id: number): Promise<IResponse<null>> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
      });

      if (!property) {
        return { error: true, message: 'Property not found', data: null };
      }

      await this.propertyRepository.delete(id);

      return { error: false, message: 'Property deleted', data: null };
    } catch (error) {
      console.error(error.message);
      return {
        error: true,
        message: 'Some error ocurred while deleting the property',
        data: null,
      };
    }
  }

  generateSlug(property: Property): string {
    return `${property.id}?type=${property.type}&city=${property.city}&bathrooms=${property.bathrooms}&bedrooms=${property.bedrooms}&area=${property.area}`;
  }
}
