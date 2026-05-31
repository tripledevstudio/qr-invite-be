import { Injectable, Inject } from '@nestjs/common';
import type { StoreRepository } from '../../domain/repositories/store.repository';
import { STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';
import { UpdateStoreDto } from '../../dto/update-store.dto';
import { Store } from '../../domain/entities/store.entity';

@Injectable()
export class UpdateStoreUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  async execute(id: string, dto: UpdateStoreDto): Promise<Store> {
    return this.storeRepo.update(id, dto);
  }
}