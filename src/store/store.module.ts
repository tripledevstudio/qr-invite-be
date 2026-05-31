import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { STORE_REPOSITORY_TOKEN } from './domain/repositories/store.repository';
import { DynamoStoreRepository } from './infrastructure/dynamo/dynamo-store.repository';
import { CreateStoreUseCase } from './application/use-cases/create-store.usecase';
import { ListStoresUseCase } from './application/use-cases/list-stores.usecase';
import { GetStoreUseCase } from './application/use-cases/get-store.usecase';
import { UpdateStoreUseCase } from './application/use-cases/update-store.usecase';
import { DeleteStoreUseCase } from './application/use-cases/delete-store.usecase';

@Module({
  imports: [DynamoModule],
  controllers: [StoreController],
  providers: [
    { provide: STORE_REPOSITORY_TOKEN, useClass: DynamoStoreRepository },
    CreateStoreUseCase,
    ListStoresUseCase,
    GetStoreUseCase,
    UpdateStoreUseCase,
    DeleteStoreUseCase,
  ],
  exports: [],
})
export class StoreModule {}