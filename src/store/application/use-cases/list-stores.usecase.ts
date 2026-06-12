import { Injectable, Inject } from '@nestjs/common';
import type { StoreRepository } from '../../domain/repositories/store.repository';
import { STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';
import { Store } from '../../domain/entities/store.entity';

@Injectable()
export class ListStoresUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  // async execute(adminId: string): Promise<Store[]> {
  //   const stores = await this.storeRepo.findAll();
  //   return stores.filter((store) => store.user_id === adminId);
  // }
  async execute(): Promise<Store[]> {
    return await this.storeRepo.findAll();
  }
}
