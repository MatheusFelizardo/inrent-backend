import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { error } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(username);

    if (user && user.deletedAt) {
      await this.usersService.reactivate(user.id);
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException({
        error: true,
        message: 'Invalid email or password',
        data: null,
      });
    }
    const payload = {
      sub: user.id,
      username: user.email,
      role: user.role,
      isEmailConfirmed: user.isEmailConfirmed,
      isPhoneConfirmed: user.isPhoneConfirmed,
      isPasswordSet: user.isPasswordSet,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
