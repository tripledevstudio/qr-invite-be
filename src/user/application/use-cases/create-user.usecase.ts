import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN)
    private readonly storeRepository: StoreRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const user = new User({
      name: dto.name,
      email: dto.email,
      phone_number: dto.phone_number,
      ref_code: dto.ref_code,
      invite_code: dto.invite_code,
      rank: dto.rank,
      role: dto.role,
      store_ids: dto.store_ids || [],
    });
    
    const createdUser = await this.userRepository.create(user);

    if (createdUser.store_ids && createdUser.store_ids.length > 0) {
      for (const store_id of createdUser.store_ids) {
        try {
          const store = await this.storeRepository.findOne(store_id);
          const collaboratorIds = Array.isArray(store.collaborator_ids) ? store.collaborator_ids : [];
          if (!collaboratorIds.includes(createdUser.id!)) {
            collaboratorIds.push(createdUser.id!);
            await this.storeRepository.update(store_id, {
              collaborator_ids: collaboratorIds,
              collaborator_count: collaboratorIds.length,
            });
          }
        } catch (error) {
          console.warn(`Store not found or error updating store ${store_id}:`, error);
        }
      }
    }

    return createdUser;
  }
}
