import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { IResponse } from 'src/types';
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
}
