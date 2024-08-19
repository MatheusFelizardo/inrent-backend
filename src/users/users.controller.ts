import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { IResponse } from '../types';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Public()
  @Get('profile/:id')
  // for now it brings the user. Update it to bring the profile!
  async getProfile(
    @Param('id') id: number,
  ): Promise<IResponse<UserResponseDto>> {
    const response = await this.userService.getProfileById(id);

    if (response.error) {
      throw new ConflictException(response.message);
    }

    return response;
  }

  @Public()
  @Post('register')
  async create(
    @Body()
    register: {
      email: string;
      password: string;
    },
  ): Promise<IResponse<UserResponseDto>> {
    const response = await this.userService.create(register);

    if (response.error) {
      throw new ConflictException(response.message);
    }

    return response;
  }

  @Put('update')
  async update(@Request() req): Promise<IResponse<UserResponseDto>> {
    const response = await this.userService.update(req.user.sub, req.body);

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
