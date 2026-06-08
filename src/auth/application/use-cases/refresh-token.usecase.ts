import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      });
      
      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        phone_number: payload.phone_number,
        role: payload.role,
        store_id: payload.store_id, // include for admin payload
      };

      // clean undefined values
      Object.keys(newPayload).forEach(
        (key) => newPayload[key as keyof typeof newPayload] === undefined && delete newPayload[key as keyof typeof newPayload]
      );

      return {
        message: 'Success',
        access_token: this.jwtService.sign(newPayload, {
          secret: process.env.JWT_SECRET || 'secretKey',
          expiresIn: '1h',
        }),
        refresh_token: this.jwtService.sign(newPayload, {
          secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
          expiresIn: '7d',
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}