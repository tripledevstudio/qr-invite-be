import { Injectable, Inject } from '@nestjs/common';
import type { StoreRepository } from '../../domain/repositories/store.repository';
import { STORE_REPOSITORY_TOKEN } from '../../domain/repositories/store.repository';
import { CreateStoreDto } from '../../dto/create-store.dto';
import { Store } from '../../domain/entities/store.entity';

@Injectable()
export class CreateStoreUseCase {
  constructor(@Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository) {}

  async execute(dto: CreateStoreDto): Promise<Store> {
    return this.storeRepo.create(dto);
  }
}