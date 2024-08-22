import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { IResponse } from 'src/types';
import { CreatePropertyDto, PropertyResponseDto } from './dto/property.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PropertyPhotoResponseDto } from './dto/propertyPhotos.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async findAll(): Promise<IResponse<PropertyResponseDto[]>> {
    return await this.propertiesService.findAll();
  }

  @Post('create')
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<IResponse<PropertyResponseDto>> {
    return await this.propertiesService.create(createPropertyDto);
  }

  @Post('upload-photo/:id')
  @UseInterceptors(
    AnyFilesInterceptor({
      dest: './uploads',
      fileFilter: (req, file, cb) => {
        if (file.size > 8 * 1024 * 1024) {
          return cb(new Error('File is too big!'), false);
        }

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadPhoto(
    @UploadedFiles() photos: Array<Express.Multer.File>,
    @Param('id') id: number,
    @Body('metadata')
    metadata: string,
  ): Promise<IResponse<PropertyPhotoResponseDto[]>> {
    const metadataObj = JSON.parse(metadata) as {
      photo: string;
      description?: string;
      showInGallery?: boolean;
      labels?: number[];
    }[];
    return await this.propertiesService.uploadPhoto(id, photos, metadataObj);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: number,
    @Body() createPropertyDto: CreatePropertyDto,
  ): Promise<IResponse<PropertyResponseDto>> {
    return await this.propertiesService.update(id, createPropertyDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number): Promise<IResponse<null>> {
    return await this.propertiesService.delete(id);
  }
}
