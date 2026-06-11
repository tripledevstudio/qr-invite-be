import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFY_SECRET || 'verifySecret',
      });
      const user = await this.userRepository.findById(payload.sub);
      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.update(user.id, { is_verify: true });
      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
