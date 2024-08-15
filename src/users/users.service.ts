import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UserResponseDto } from './user.dto';
import { IResponse } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getProfileById(id: number): Promise<IResponse<UserResponseDto>> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        return {
          error: true,
          data: null,
          message: 'User not found',
        };
      }

      return {
        error: false,
        data: new UserResponseDto(user),
        message: 'User found',
      };
    } catch (error) {
      return {
        error: true,
        data: null,
        message: 'Something went wrong',
      };
    }
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<IResponse<UserResponseDto>> {
    try {
      const { email, password } = createUserDto;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const existingUser = await this.usersRepository.findOneBy({ email });
      if (existingUser) {
        return {
          error: true,
          data: null,
          message: 'User already exists',
        };
      }

      const user = new User();
      user.email = email;
      user.password = hashedPassword;
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.isPasswordSet = true;
      await this.usersRepository.save(user);

      return {
        error: false,
        data: new UserResponseDto(user),
        message: 'User created successfully',
      };
    } catch (error) {
      return {
        error: true,
        data: null,
        message: 'Something went wrong',
      };
    }
  }

  async update(
    id: number,
    updateUserDto: CreateUserDto & { deletedAt?: Date },
  ): Promise<IResponse<UserResponseDto>> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        return {
          error: true,
          data: null,
          message: 'User not found',
        };
      }

      const { email, password, firstName, lastName, deletedAt } = updateUserDto;

      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
      }
      if (updateUserDto.deletedAt) user.deletedAt = deletedAt;
      if (updateUserDto.email) user.email = email;
      if (updateUserDto.firstName) user.firstName = firstName;
      if (updateUserDto.lastName) user.lastName = lastName;

      await this.usersRepository.save(user);

      return {
        error: false,
        data: new UserResponseDto(user),
        message: 'User updated successfully',
      };
    } catch (error) {
      return {
        error: true,
        data: null,
        message: 'Something went wrong',
      };
    }
  }

  async remove(id: number): Promise<IResponse<UserResponseDto>> {
    try {
      await this.usersRepository.softDelete(id);
      return {
        error: false,
        data: null,
        message: 'User removed successfully',
      };
    } catch (error) {
      console.error(error.message);
      return {
        error: true,
        data: null,
        message: 'Something went wrong',
      };
    }
  }

  async reactivate(id: number): Promise<IResponse<UserResponseDto>> {
    try {
      await this.usersRepository.restore(id);
      return {
        error: false,
        data: null,
        message: 'User reactivated successfully',
      };
    } catch (error) {
      console.error(error.message);
      return {
        error: true,
        data: null,
        message: 'Something went wrong',
      };
    }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      withDeleted: true,
    });
  }
}
