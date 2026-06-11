import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';
import { STORE_USER_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store-user.repository';
import type { StoreUserRepository } from '../../../store/domain/repositories/store-user.repository';
import { StoreUser } from '../../../store/domain/entities/store-user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN)
    private readonly storeRepository: StoreRepository,
    @Inject(STORE_USER_REPOSITORY_TOKEN)
    private readonly storeUserRepository: StoreUserRepository,
  ) {}

  async execute(id: string, dto: Partial<User>): Promise<User> {
    const oldUser = await this.userRepository.findById(id);
    const updateData: Partial<User> = {
      ...dto,
      updated_at: new Date().toISOString(),
    };
    const updatedUser = await this.userRepository.update(id, updateData);

    // Sync StoreUser entries based on updated user data
    const oldStoreIds = oldUser?.store_ids || [];
    const newStoreIds = updatedUser.store_ids || [];

    // Remove StoreUser entries for stores no longer associated
    const removedStores = oldStoreIds.filter((sid) => !newStoreIds.includes(sid));
    for (const storeId of removedStores) {
      await this.storeUserRepository.delete(storeId, updatedUser.id);
      // Update collaborator count after removal
      const remaining = await this.storeUserRepository.findByStoreId(storeId);
      await this.storeRepository.update(storeId, {
        collaborator_count: remaining.length,
      });
    }

    // Upsert StoreUser entries for all currently associated stores
    for (const storeId of newStoreIds) {
      await this.storeUserRepository.create(
        new StoreUser({
          store_id: storeId,
          user_id: updatedUser.id,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          is_verify: updatedUser.is_verify ?? false,
          role: updatedUser.role,
          gender: updatedUser.gender,
          birth_date: updatedUser.birth_date,
          occupation: updatedUser.occupation,
        }),
      );
      // Update collaborator count after upsert
      const storeUsers = await this.storeUserRepository.findByStoreId(storeId);
      await this.storeRepository.update(storeId, {
        collaborator_count: storeUsers.length,
      });
    }

    return updatedUser;
  }
}
