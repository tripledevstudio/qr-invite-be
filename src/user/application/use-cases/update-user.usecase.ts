import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN)
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(id: string, dto: Partial<User>): Promise<User> {
    const oldUser = await this.userRepository.findById(id);
    const updateData: Partial<User> = {
      ...dto,
      updated_at: new Date().toISOString(),
    };
    const updatedUser = await this.userRepository.update(id, updateData);

    if (dto.store_ids !== undefined) {
      const oldStores = oldUser?.store_ids || [];
      const newStores = dto.store_ids || [];

      const added = newStores.filter(x => !oldStores.includes(x));
      const removed = oldStores.filter(x => !newStores.includes(x));

      for (const store_id of added) {
        try {
          const store = await this.storeRepository.findOne(store_id);
          const collaboratorIds = Array.isArray(store.collaborator_ids) ? store.collaborator_ids : [];
          if (!collaboratorIds.includes(id)) {
            collaboratorIds.push(id);
            await this.storeRepository.update(store_id, {
              collaborator_ids: collaboratorIds,
              collaborator_count: collaboratorIds.length,
            });
          }
        } catch (error) {
          console.warn(`Store not found or error adding collaborator to store ${store_id}:`, error);
        }
      }

      for (const store_id of removed) {
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

    return updatedUser;
  }
}
