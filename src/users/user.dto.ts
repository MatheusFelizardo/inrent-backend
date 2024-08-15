import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { User } from './user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @Expose({ name: 'email' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @Expose({ name: 'first_name' })
  firstName: string;

  @IsNotEmpty()
  @Expose({ name: 'last_name' })
  lastName: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
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
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.isEmailConfirmed = user.isEmailConfirmed;
    this.isPhoneConfirmed = user.isPhoneConfirmed;
    this.isPasswordSet = user.isPasswordSet;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }
}
