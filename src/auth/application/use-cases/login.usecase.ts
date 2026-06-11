import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../../dto/login.dto';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { User } from '../../../user/domain/entities/user.entity';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto) {
    const { phone_number, user_name, password } = loginDto as any;

    if (!phone_number && !user_name) {
      throw new BadRequestException('Phone number or user name is required');
    }

    let user: User | null = null;
    if (phone_number) {
      user = await this.userRepository.findByPhone(phone_number);
    } else if (user_name) {
      user = await this.userRepository.findByUserName(user_name);
    }

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      store_id: user.current_store_id,
    };

    return {
      message: 'Success',
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'secretKey',
        expiresIn: '1h',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
        expiresIn: '7d',
      }),
    };
  }
}
