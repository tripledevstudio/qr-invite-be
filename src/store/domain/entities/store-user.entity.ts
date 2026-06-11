import { UserGender } from '../../../user/domain/entities/user.entity';

export class StoreUser {
  store_id!: string;
  user_id!: string;
  name?: string;
  avatar?: string;
  is_verify?: boolean;
  role?: string;
  gender?: UserGender;
  birth_date?: string;
  occupation?: string;
  created_at?: string;

  constructor(partial: Partial<StoreUser>) {
    Object.assign(this, partial);
    if (!this.created_at) this.created_at = new Date().toISOString();
    if (this.is_verify === undefined) this.is_verify = false;
  }
}
