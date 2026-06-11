import { BadRequestException, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
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
    const { user_name, password } = dto;

    if (!user_name) {
      throw new BadRequestException('User name is required');
    }

    let admin: Admin | null = null;

    if (user_name) {
      admin = await this.adminRepository.findByUserName(user_name.trim().toUpperCase());
    }

    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const passwordMatches = await bcrypt.compare(password, admin.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: admin.id,
      user_name: admin.user_name,
      role: 'ADMIN',
      store_id: admin.current_store_id,
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
