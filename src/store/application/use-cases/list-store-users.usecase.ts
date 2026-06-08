import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { STORE_USER_REPOSITORY_TOKEN } from '../../domain/repositories/store-user.repository';
import type { StoreUserRepository } from '../../domain/repositories/store-user.repository';
import { StoreUser } from '../../domain/entities/store-user.entity';

@Injectable()
export class ListStoreUsersUseCase {
    constructor(
        @Inject(STORE_USER_REPOSITORY_TOKEN)
        private readonly storeUserRepository: StoreUserRepository,
    ) { }

    async execute(storeId: string): Promise<StoreUser[]> {
        // Verify store existence could be added, but we assume valid storeId
        const users = await this.storeUserRepository.findByStoreId(storeId);
        if (!users) {
            throw new NotFoundException('Store users not found');
        }
        return users;
    }
}