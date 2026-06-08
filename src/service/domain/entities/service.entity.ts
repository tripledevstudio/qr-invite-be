export class Service {
  id: string;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  points_value?: number;
  monetary_value?: number;
  quantity?: number;
  store_id?: string;
  created_at: string;
  updated_at: string;

  constructor(partial: Partial<Service>) {
    Object.assign(this, partial);
    if (!this.created_at) this.created_at = new Date().toISOString();
    if (!this.updated_at) this.updated_at = new Date().toISOString();
    if (this.points_value === undefined) this.points_value = 0;
    if (this.monetary_value === undefined) this.monetary_value = 0;
    if (this.quantity === undefined) this.quantity = 0;
    if (!this.images) this.images = [];
  }
}
