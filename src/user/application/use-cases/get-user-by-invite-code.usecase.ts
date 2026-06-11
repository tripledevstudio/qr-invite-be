import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';

@Injectable()
export class GetUserByInviteCodeUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(inviteCode: string): Promise<User | null> {
    return this.userRepository.findByInviteCode(inviteCode);
  }
}
