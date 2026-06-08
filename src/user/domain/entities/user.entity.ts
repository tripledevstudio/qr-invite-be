export enum UserRank {
  COPPER = 'COPPER',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
}

export enum UserRole {
  COLLABORATOR = 'COLLABORATOR',
  OWNER = 'OWNER',
}
export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class User {
  id: string;
  name: string;
  user_name?: string;
  email: string;
  phone_number?: string;
  password?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  is_verify: boolean;
  ref_code?: string;
  invite_code?: string;
  rank?: UserRank;
  role?: UserRole;
  bonus_current?: number;
  bonus_pending?: number;
  bonus_received?: number;
  avatar?: string;
  forgot_password_otp?: string;
  forgot_password_otp_expires_at?: string;
  store_ids?: string[];
  current_store_id?: string;
  gender?: UserGender;
  birth_date?: string;
  occupation?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    if (!this.created_at) this.created_at = new Date().toISOString();
    if (!this.updated_at) this.updated_at = new Date().toISOString();
    if (this.is_active === undefined) this.is_active = true;
    if (this.is_verify === undefined) this.is_verify = false;
    if (this.bonus_current === undefined) this.bonus_current = 0;
    if (this.bonus_pending === undefined) this.bonus_pending = 0;
    if (this.bonus_received === undefined) this.bonus_received = 0;
    if (!this.store_ids) this.store_ids = [];
  }
}
