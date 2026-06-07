import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN)
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    
    if (user && user.store_ids && user.store_ids.length > 0) {
      for (const store_id of user.store_ids) {
        try {
          const store = await this.storeRepository.findOne(store_id);
          const collaboratorIds = Array.isArray(store.collaborator_ids) ? store.collaborator_ids : [];
          if (collaboratorIds.includes(id)) {
            const index = collaboratorIds.indexOf(id);
            collaboratorIds.splice(index, 1);
            await this.storeRepository.update(store_id, {
              collaborator_ids: collaboratorIds,
              collaborator_count: collaboratorIds.length,
            });
          }
        } catch (error) {
          console.warn(`Store not found or error removing collaborator from store ${store_id}:`, error);
        }
      }
    }

    await this.userRepository.delete(id);
  }
}
