import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { CreateUserDto } from '../user.dto';
import { UsersService } from '../users.service';
import {
  getRepositoryToken,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { Property } from '../../properties/entities/property.entity';
import { PropertyPhotos } from '../../properties/entities/property-photos.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let authService: AuthService;
  let dataSource: DataSource;
  let jwtToken: string;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
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
          entities: [User, Profile, Property, PropertyPhotos],
          synchronize: true,
        } as TypeOrmModuleOptions),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService, AuthService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    dataSource = module.get<DataSource>(DataSource);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    await usersRepository.query('SET FOREIGN_KEY_CHECKS = 0;');
    await usersRepository.clear();
    await usersRepository.query('SET FOREIGN_KEY_CHECKS = 1;');
    await dataSource.destroy();
  });

  const testUser = {
    email: 'test@test.com',
    password: 'password',
  } as CreateUserDto;

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user in the database', async () => {
    const result = await controller.create(testUser);
    expect(result.data.email).toBe(testUser.email);

    const createdUser = await service.findOne(result.data.id);
    expect(createdUser).toBeDefined();
    expect(createdUser.email).toBe(testUser.email);
  });

  it('should throw ConflictException when creating a user that already exists', async () => {
    await expect(controller.create(testUser)).rejects.toThrow(
      ConflictException,
    );
  });

  it('should be able to authenticate and get JWT', async () => {
    const result = await authService.signIn(testUser.email, testUser.password);
    jwtToken = result.access_token;
    expect(result).toBeDefined();
    expect(jwtToken).toBeDefined();
  });

  it('should update a user in the database', async () => {
    const user = await usersRepository.findOne({
      where: { email: testUser.email },
    });

    const payloadMock = {
      user: {
        sub: user.id,
        email: user.email,
      },
      body: {
        deletedAt: null,
      },
    };

    const updatedUser = await controller.update(payloadMock);
    expect(updatedUser.data.deletedAt).toBeNull();
  });

  it('should return the user from the database by id', async () => {
    const result = await controller.getProfile(1);
    expect(result.data.email).toBe(testUser.email);
  });

  it('should delete the user from the database', async () => {
    const user = await usersRepository.findOne({
      where: { email: testUser.email },
    });

    const payloadMock = {
      user: {
        sub: user.id,
        email: user.email,
      },
    };
    await controller.remove(payloadMock);

    const deletedUser = await service.findOne(user.id);
    expect(deletedUser).toBeNull();
  });
});
