import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from '../properties.controller';
import { ConfigModule } from '@nestjs/config';
import {
  getRepositoryToken,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Property } from '../entities/property.entity';
import { PropertyPhotos } from '../entities/property-photos.entity';
import { User } from '../../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Profile } from '../../users/entities/profile.entity';
import { DataSource, Repository } from 'typeorm';
import { PropertiesService } from '../properties.service';
import { CreatePropertyDto, PropertyResponseDto } from '../dto/property.dto';
import { UsersService } from '../../users/users.service';
import { Labels } from '../entities/labels.entity';
import { PhotoLabels } from '../entities/photo-labels.entity';
import { unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;
  let usersService: UsersService;
  let repository: Repository<Property>;
  let userRepository: Repository<User>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: 'inrent-test',
          entities: [
            User,
            Profile,
            Property,
            PropertyPhotos,
            Labels,
            PhotoLabels,
          ],
          synchronize: true,
        } as TypeOrmModuleOptions),
        TypeOrmModule.forFeature([
          Property,
          User,
          Labels,
          PhotoLabels,
          PropertyPhotos,
        ]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [PropertiesController],
      providers: [PropertiesService, UsersService],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
    repository = module.get<Repository<Property>>(getRepositoryToken(Property));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    usersService = module.get<UsersService>(UsersService);
    dataSource = module.get<DataSource>(DataSource);
  });
  let userId: number;
  let propertyObjectMock = {
    title: 'Property 1',
    description: 'Description',
    type: 'house',
    status: 'for_rent',
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    area: 100,
    furnished: true,
    acceptAnimals: false,
    fullAddress: '123 Main St',
    addressComplement: 'Apt 1',
    addressNumber: 123,
    city: 'New York',
    zipcode: '12345',
    longitude: '123.456',
    latitude: '123.456',
    price: 1000,
    available: true,
    featured: false,
    userId: null,
  } as CreatePropertyDto;

  let savedProperty: PropertyResponseDto;

  beforeEach(async () => {
    const hasUser = await usersService.findByEmail('test@test.com');

    if (hasUser) {
      userId = hasUser.id;
      propertyObjectMock.userId = userId;
      return;
    }

    const response = await usersService.create({
      email: 'test@test.com',
      password: '123456',
    });
    userId = response?.data?.id;
    propertyObjectMock.userId = userId;
  });

  afterAll(async () => {
    await repository.query('SET FOREIGN_KEY_CHECKS = 0;');
    await repository.clear();
    await repository.query('SET FOREIGN_KEY_CHECKS = 1;');

    await userRepository.query('SET FOREIGN_KEY_CHECKS = 0;');
    await userRepository.clear();
    await userRepository.query('SET FOREIGN_KEY_CHECKS = 1;');

    await dataSource.destroy();

    try {
      unlinkSync(
        join(
          __dirname,
          '../../../',
          'uploads',
          '/properties/1/test-image.jpeg',
        ),
      );
      unlinkSync(
        join(
          __dirname,
          '../../../',
          'uploads',
          '/properties/1/test-image-two.jpeg',
        ),
      );
    } catch (error) {
      console.error('Error deleting test files:', error);
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of all properties in the system', async () => {
    const mockProperties = [
      { id: 1, title: 'Property 1' },
      { id: 2, title: 'Property 2' },
    ];
    jest
      .spyOn(repository, 'find')
      .mockResolvedValue(mockProperties as Property[]);

    const response = await controller.findAll();

    expect(response.error).toBe(false);
    expect(response.data.length).toBe(2);
    expect(response.data[0]).toBeInstanceOf(PropertyResponseDto);
    expect(response.data[0].title).toBe('Property 1');
  });

  it('should return a message if no properties are found', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([]);

    const response = await controller.findAll();

    expect(response.error).toBe(false);
    expect(response.message).toBe('No properties found');
    expect(response.data).toBeNull();
  });

  it('should return an error if there is a database issue', async () => {
    jest
      .spyOn(repository, 'find')
      .mockRejectedValue(new Error('Database error'));

    const response = await controller.findAll();

    expect(response.error).toBe(true);
    expect(response.message).toBe(
      'Some error ocurred while getting the property list',
    );
    expect(response.data).toBeNull();
  });

  it('should create a new property', async () => {
    const response = await controller.create(propertyObjectMock);
    savedProperty = response.data;

    expect(response.error).toBe(false);
    expect(response.message).toBe('Property created');
    expect(response.data).toBeInstanceOf(PropertyResponseDto);
  });

  it('should return an error if there is a database issue creating a property', async () => {
    jest
      .spyOn(repository, 'save')
      .mockRejectedValue(new Error('Database error'));

    const response = await controller.create(propertyObjectMock);

    expect(response.error).toBe(true);
    expect(response.message).toBe(
      'Some error ocurred while creating the property',
    );
    expect(response.data).toBeNull();
  });

  it('should update a property', async () => {
    const updatedProperty = await controller.update(savedProperty.id, {
      title: 'Updated title',
    } as CreatePropertyDto);

    expect(updatedProperty.error).toBe(false);
    expect(updatedProperty.message).toBe('Property updated');
    expect(updatedProperty.data.title).toBe('Updated title');
  });

  it('should return an error if there is a database issue updating a property', async () => {
    jest
      .spyOn(repository, 'save')
      .mockRejectedValue(new Error('Database error'));

    const response = await controller.update(savedProperty.id, {
      title: 'Updated title',
    } as CreatePropertyDto);

    expect(response.error).toBe(true);
    expect(response.message).toBe(
      'Some error ocurred while updating the property',
    );
    expect(response.data).toBeNull();
  });

  it('should return a message if the property does not exist while updating', async () => {
    const response = await controller.update(999, {
      title: 'Updated title',
    } as CreatePropertyDto);

    expect(response.error).toBe(true);
    expect(response.message).toBe('Property not found');
    expect(response.data).toBeNull();
  });

  it('should upload photos to a property', async () => {
    const mockFile = [
      {
        originalname: 'test-image.jpg',
        buffer: Buffer.from('file content'),
        mimetype: 'image/jpeg',
        size: 1024,
        path: 'uploads\\test-image',
      },
      {
        originalname: 'test-image-two.jpg',
        buffer: Buffer.from('file content'),
        mimetype: 'image/jpeg',
        size: 1024,
        path: 'uploads\\test-image-two',
      },
    ] as Express.Multer.File[];

    // create the file in uploads folder
    mockFile.forEach((file) => {
      writeFileSync(file.path, file.buffer);
    });

    const mockJson = [
      {
        photo: 'test-image.jpg',
        description: 'Photo 1',
        showInGallery: true,
        labels: ['bedroom', 'internal'],
      },
      {
        photo: 'test-image-two.jpg',
        description: 'Photo 2',
        showInGallery: false,
        labels: ['living_room', 'internal'],
      },
    ] as {
      photo: string;
      description?: string;
      showInGallery?: boolean;
      labels?: string[];
    }[];

    const response = await service.uploadPhoto(1, mockFile, mockJson);

    expect(response.error).toBe(false);
    expect(response.message).toBe('Photos uploaded');
    expect(response.data.length).toBe(2);
  });

  it('should persist the photos in the database', async () => {
    const photos = await repository.findOne({
      where: { id: savedProperty.id },
      relations: ['photos'],
    });

    expect(photos.photos.length).toBe(2);
  });

  it('should return an error if there is a database issue deleting a property', async () => {
    jest
      .spyOn(repository, 'delete')
      .mockRejectedValue(new Error('Database error'));

    const response = await controller.delete(savedProperty.id);

    expect(response.error).toBe(true);
    expect(response.message).toBe(
      'Some error ocurred while deleting the property',
    );
    expect(response.data).toBeNull();
  });

  it('should return a message if the property does not exist while deleting', async () => {
    const response = await controller.delete(999);

    expect(response.error).toBe(true);
    expect(response.message).toBe('Property not found');
    expect(response.data).toBeNull();
  });

  it('should delete a property', async () => {
    const response = await controller.delete(savedProperty.id);

    expect(response.error).toBe(false);
    expect(response.message).toBe('Property deleted');
    expect(response.data).toBeNull();
  });
});
