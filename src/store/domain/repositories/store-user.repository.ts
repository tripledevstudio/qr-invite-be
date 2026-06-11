import { StoreUser } from '../entities/store-user.entity';

export const STORE_USER_REPOSITORY_TOKEN = 'STORE_USER_REPOSITORY';

export interface StoreUserRepository {
  create(storeUser: StoreUser): Promise<StoreUser>;
  findByStoreId(storeId: string): Promise<StoreUser[]>;
  delete(storeId: string, userId: string): Promise<void>;
}
