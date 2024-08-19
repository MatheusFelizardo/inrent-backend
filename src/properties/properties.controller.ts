import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { IResponse } from 'src/types';
import { CreatePropertyDto, PropertyResponseDto } from './dto/property.dto';

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
