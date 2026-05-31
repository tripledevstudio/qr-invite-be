export class Store {
  id: string;
  name: string;
  address?: string;
  created_at: string;
  updated_at: string;

  constructor(partial: Partial<Store>) {
    Object.assign(this, partial);
    if (!this.created_at) this.created_at = new Date().toISOString();
    if (!this.updated_at) this.updated_at = new Date().toISOString();
  }
}