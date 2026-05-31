import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { USER_REPOSITORY_TOKEN } from '../user/domain/repositories/user.repository';
import type { UserRepository } from '../user/domain/repositories/user.repository';
import { User } from '../user/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phone_number, password, ...rest } = registerDto;

    if (!email && !phone_number) {
      throw new BadRequestException('Email or phone number is required');
    }

    if (email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) throw new BadRequestException('Email already exists');
    }

    if (phone_number) {
      const existingUser = await this.userRepository.findByPhone(phone_number);
      if (existingUser)
        throw new BadRequestException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...rest,
      email,
      phone_number,
      password: hashedPassword,
    });

    const createdUser = await this.userRepository.create(user);

    return this.generateTokens(createdUser);
  }

  async login(loginDto: LoginDto) {
    const { email, phone_number, password } = loginDto;

    if (!email && !phone_number) {
      throw new BadRequestException('Email or phone number is required');
    }

    let user: User | null = null;

    if (email) {
      user = await this.userRepository.findByEmail(email);
    } else if (phone_number) {
      user = await this.userRepository.findByPhone(phone_number);
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

  async logout() {
    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      });
      const user = {
        id: payload.sub,
        email: payload.email,
        phone_number: payload.phone_number,
        role: payload.role,
      };
      return this.generateTokens(user as any);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    };

    return {
      message: 'Success',
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'secretKey',
        expiresIn: '15m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
        expiresIn: '7d',
      }),
    };
  }
}
