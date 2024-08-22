import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { PropertyPhotos } from '../entities/property-photos.entity';
import { Labels } from '../entities/labels.entity';

export class CreatePropertyPhotosDto {
  propertyId: number;
  description: string;
  showInGallery: boolean;
  photoUrl: string;
}

export class PropertyPhotoResponseDto {
  id: number;
  description: string;
  showInGallery: boolean;
  photoUrl: string;
  labels: Labels[];

  constructor(property: PropertyPhotos) {
    this.id = property.id;
    this.description = property.description;
    this.showInGallery = property.showInGallery;
    this.photoUrl = property.photoUrl;
    this.labels = property.photoLabels.map((label) => label.label);
  }
}
