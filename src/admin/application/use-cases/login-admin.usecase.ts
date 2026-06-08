import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAdminDto } from '../../dto/login-admin.dto';
import { Admin } from '../../domain/entities/admin.entity';
import { ADMIN_REPOSITORY_TOKEN } from '../../domain/repositories/admin.repository';
import type { AdminRepository } from '../../domain/repositories/admin.repository';

@Injectable()
export class LoginAdminUseCase {
  constructor(
    @Inject(ADMIN_REPOSITORY_TOKEN)
    private readonly adminRepository: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginAdminDto) {
    const { phone_number, password } = dto;

    if (!phone_number) {
      throw new BadRequestException('Phone number is required');
    }

    const admin: Admin | null = await this.adminRepository.findByPhone(phone_number);

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      store_id: admin.store_id,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'defaultSecret',
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      expiresIn: '7d',
    });

    return { token, refreshToken };
  }
}