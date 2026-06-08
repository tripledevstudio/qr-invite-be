import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';
import { STORE_USER_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store-user.repository';
import type { StoreUserRepository } from '../../../store/domain/repositories/store-user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN)
    private readonly storeRepository: StoreRepository,
    @Inject(STORE_USER_REPOSITORY_TOKEN)
    private readonly storeUserRepository: StoreUserRepository,
  ) { }

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (user?.store_ids && user.store_ids.length > 0) {
      for (const storeId of user.store_ids) {
        await this.storeUserRepository.delete(storeId, id);
        const remaining = await this.storeUserRepository.findByStoreId(storeId);
        await this.storeRepository.update(storeId, {
          collaborator_count: remaining.length,
        });
      }
    }

    await this.userRepository.delete(id);
  }
}
