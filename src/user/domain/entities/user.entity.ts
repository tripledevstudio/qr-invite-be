export class User {
  id: string;
  name: string;
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
  rank?: string;
  role?: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
    if (!this.created_at) this.created_at = new Date().toISOString();
    if (!this.updated_at) this.updated_at = new Date().toISOString();
    if (this.is_active === undefined) this.is_active = true;
    if (this.is_verify === undefined) this.is_verify = false;
  }
}
