import { Admin } from '../entities/admin.entity';

export interface AdminRepository {
  create(admin: Admin): Promise<Admin>;
  findById(id: string): Promise<Admin | null>;
  findByEmail(email: string): Promise<Admin | null>;
  findByPhone(phone: string): Promise<Admin | null>;
  findByUserName(userName: string): Promise<Admin | null>;
  findByStoreId(storeId: string): Promise<Admin | null>;
  update(id: string, admin: Partial<Admin>): Promise<Admin>;
  delete(id: string): Promise<void>;
}

export const ADMIN_REPOSITORY_TOKEN = 'AdminRepository';