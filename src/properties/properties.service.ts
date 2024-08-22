import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Repository } from 'typeorm';
import { IResponse } from 'src/types';
import { CreatePropertyDto, PropertyResponseDto } from './dto/property.dto';
import { existsSync, mkdirSync, promises } from 'fs';
import { PropertyPhotos } from './entities/property-photos.entity';
import { PropertyPhotoResponseDto } from './dto/propertyPhotos.dto';
import { Labels } from './entities/labels.entity';
import { PhotoLabels } from './entities/photo-labels.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(PropertyPhotos)
    private propertyPhotosRepository: Repository<PropertyPhotos>,
    @InjectRepository(PhotoLabels)
    private photoLabelsRepository: Repository<PhotoLabels>,
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
      // console.error(error.message);
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
      // console.error(error.message);
      return {
        error: true,
        message: 'Some error ocurred while creating the property',
        data: null,
      };
    }
  }

  async uploadPhoto(
    id: number,
    photos: Array<Express.Multer.File>,
    metadata: {
      photo: string;
      description?: string;
      showInGallery?: boolean;
      labels?: number[];
    }[],
  ): Promise<IResponse<PropertyPhotoResponseDto[]>> {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
      });

      if (!property) {
        return { error: true, message: 'Property not found', data: null };
      }

      const savedPhotos = [];
      for (const photo of photos) {
        const path = await this.movePhotoToFolder(photo, id);
        const originalName = photo.originalname;
        const savedPhotoMetadata = metadata.filter(
          (data) => data.photo === originalName,
        )[0];
        const { description, showInGallery, labels } = savedPhotoMetadata;

        const propertyPhoto = this.propertyPhotosRepository.create({
          propertyId: id,
          photoUrl: path,
          description,
          showInGallery,
        });
        const savedPhoto =
          await this.propertyPhotosRepository.save(propertyPhoto);

        for (const label of labels) {
          await this.photoLabelsRepository.save({
            labelId: label,
            propertyPhotoId: savedPhoto.id,
          });
        }

        const updatedSavedPhotosWithLabels =
          await this.propertyPhotosRepository.find({
            where: { id: savedPhoto.id },
            relations: ['photoLabels'],
          });

        savedPhotos.push(updatedSavedPhotosWithLabels);
      }

      return {
        error: false,
        message: 'Photos uploaded',
        data: savedPhotos,
      };
    } catch (error) {
      // console.error(error.message);
      return {
        error: true,
        message: 'Some error ocurred while uploading the photo',
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
      // console.error(error);
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
      // console.error(error.message);
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

  async movePhotoToFolder(
    photo: Express.Multer.File,
    id: number,
  ): Promise<string> {
    const path = `./uploads/properties/${id}`;
    const hasFolder = existsSync(path);
    if (!hasFolder) {
      mkdirSync(path);
    }

    const photoFormat = photo.mimetype.split('/')[1];
    const photoName = `${photo.path.replace('uploads\\', '')}.${photoFormat}`;
    const newPath = `${path}/${photoName}`;
    await promises.rename(photo.path, newPath);

    return `/properties/${id}/${photoName}`;
  }
}
