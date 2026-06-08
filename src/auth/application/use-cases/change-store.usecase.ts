import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';

@Injectable()
export class ChangeStoreUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async execute(user_id: string, newStoreId: string) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Optional: verify that store exists using StoreRepository, or if user has access to it.
    // For now we just update it.
    await this.userRepository.update(user_id, { current_store_id: newStoreId });

    // Ensure it's in the array if needed (though not explicitly required, it might be good practice)
    // If requirement doesn't mention, let's keep it simple and just update the current_store_id.

    // Refresh user data (if necessary, though we have it)
    user.current_store_id = newStoreId;

    const payload = {
      sub: user.id,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      store_id: user.current_store_id,
    };

    // Clean undefined values
    Object.keys(payload).forEach(
      (key) => payload[key as keyof typeof payload] === undefined && delete payload[key as keyof typeof payload]
    );

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