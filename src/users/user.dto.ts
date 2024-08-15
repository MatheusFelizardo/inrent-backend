import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from './entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose({ name: 'email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isPasswordSet: boolean;
  isEmailConfirmed: boolean;
  isPhoneConfirmed: boolean;
  role: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
    this.isEmailConfirmed = user.isEmailConfirmed;
    this.isPhoneConfirmed = user.isPhoneConfirmed;
    this.isPasswordSet = user.isPasswordSet;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
