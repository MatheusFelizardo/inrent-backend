import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { IResponse } from '../types';
import { UsersService } from './users.service';
import { UserResponseDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Post('register')
  async create(
    @Body()
    register: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ): Promise<IResponse<UserResponseDto>> {
    const response = await this.userService.create(register);

    if (response.error) {
      throw new ConflictException(response.message);
    }

    return response;
  }

  @Delete('remove')
  async remove(@Request() req): Promise<IResponse<UserResponseDto>> {
    const response = await this.userService.remove(req.user.sub);

    if (response.error) {
      throw new ConflictException(response.message);
    }

    return response;
  }
}
