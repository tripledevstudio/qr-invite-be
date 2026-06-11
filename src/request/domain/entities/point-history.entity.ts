export class PointHistory {
  id?: string;
  user_id!: string;
  store_id!: string;
  amount!: number;
  type!: string;
  created_at?: string;

  // Additional fields for process check-in logging
  collaborator_id?: string;
  order_amount?: number;
  status?: 'IN' | 'OUT';

  constructor(partial: Partial<PointHistory>) {
    Object.assign(this, partial);
    if (!this.created_at) this.created_at = new Date().toISOString();
  }
}
