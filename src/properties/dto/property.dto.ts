import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Property } from '../entities/property.entity';
import { PropertyPhotos } from '../entities/property-photos.entity';

export class CreatePropertyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  type: string;

  status: string;

  @IsNotEmpty()
  bedrooms: number;

  @IsNotEmpty()
  bathrooms: number;

  parking: number;

  @IsNotEmpty()
  area: number;

  furnished: boolean;

  acceptAnimals: boolean;

  @IsNotEmpty()
  fullAddress: string;

  addressComplement: string;

  addressNumber: number;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  zipcode: string;

  longitude: string;

  latitude: string;

  @IsNotEmpty()
  price: number;

  available: boolean;

  featured: boolean;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  slug: string;

  photos: PropertyPhotos[];
}

export class PropertyResponseDto {
  id: number;
  title: string;
  description: string;
  slug: string;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  furnished: boolean;
  acceptAnimals: boolean;
  fullAddress: string;
  addressComplement: string;
  addressNumber: number;
  city: string;
  zipcode: string;
  longitude: string;
  latitude: string;
  price: number;
  available: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(property: Property) {
    this.id = property.id;
    this.title = property.title;
    this.description = property.description;
    this.slug = property.slug;
    this.type = property.type;
    this.status = property.status;
    this.bedrooms = property.bedrooms;
    this.bathrooms = property.bathrooms;
    this.parking = property.parking;
    this.area = property.area;
    this.furnished = property.furnished;
    this.acceptAnimals = property.acceptAnimals;
    this.fullAddress = property.fullAddress;
    this.addressComplement = property.addressComplement;
    this.addressNumber = property.addressNumber;
    this.city = property.city;
    this.zipcode = property.zipcode;
    this.longitude = property.longitude;
    this.latitude = property.latitude;
    this.price = property.price;
    this.available = property.available;
    this.featured = property.featured;
    this.createdAt = property.createdAt;
    this.updatedAt = property.updatedAt;
    this.deletedAt = property.deletedAt;
  }
}
