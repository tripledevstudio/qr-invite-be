import { Injectable, Inject } from '@nestjs/common';
import type { StoreRepository } from '../../domain/repositories/store.repository';
import { STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';

@Injectable()
export class DeleteStoreUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  async execute(id: string): Promise<{ deleted: boolean }> {
    return this.storeRepo.remove(id);
  }
}
