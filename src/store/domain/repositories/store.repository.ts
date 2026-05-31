export const STORE_REPOSITORY_TOKEN = 'STORE_REPOSITORY';

export interface StoreRepository {
  create(dto: any): Promise<any>;
  findAll(): Promise<any[]>;
  findOne(id: string): Promise<any>;
  update(id: string, dto: any): Promise<any>;
  remove(id: string): Promise<{ deleted: boolean }>;
}