import { User } from '../entities/user.entity';

export interface UserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
  findByInviteCode(inviteCode: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY_TOKEN = 'UserRepository';
