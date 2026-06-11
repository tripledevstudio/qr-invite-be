import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { STORE_REPOSITORY_TOKEN } from './domain/repositories/store.repository';
import { DynamoStoreRepository } from './infrastructure/dynamo/dynamo-store.repository';
import { STORE_USER_REPOSITORY_TOKEN } from './domain/repositories/store-user.repository';
import { DynamoStoreUserRepository } from './infrastructure/dynamo/dynamo-store-user.repository';
import { CreateStoreUseCase } from './application/use-cases/create-store.usecase';
import { ListStoresUseCase } from './application/use-cases/list-stores.usecase';
import { GetStoreUseCase } from './application/use-cases/get-store.usecase';
import { UpdateStoreUseCase } from './application/use-cases/update-store.usecase';
import { DeleteStoreUseCase } from './application/use-cases/delete-store.usecase';
import { ListStoreUsersUseCase } from './application/use-cases/list-store-users.usecase';

@Module({
  imports: [DynamoModule],
  controllers: [StoreController],
  providers: [
    { provide: STORE_REPOSITORY_TOKEN, useClass: DynamoStoreRepository },
    { provide: STORE_USER_REPOSITORY_TOKEN, useClass: DynamoStoreUserRepository },
    CreateStoreUseCase,
    ListStoresUseCase,
    GetStoreUseCase,
    UpdateStoreUseCase,
    DeleteStoreUseCase,
    ListStoreUsersUseCase,
  ],
  exports: [STORE_REPOSITORY_TOKEN, STORE_USER_REPOSITORY_TOKEN],
})
export class StoreModule {}
