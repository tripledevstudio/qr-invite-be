import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, dto: Partial<User>): Promise<User> {
    const updateData: Partial<User> = {
      ...dto,
      updated_at: new Date().toISOString(),
    };
    return this.userRepository.update(id, updateData);
  }
}
