export class CheckIn {
  id?: string;
  user_id!: string;
  store_id!: string;
  timestamp?: string;

  // new fields for process checkin
  order_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  points_awarded?: number;

  constructor(partial: Partial<CheckIn>) {
    Object.assign(this, partial);
    if (!this.timestamp) this.timestamp = new Date().toISOString();
  }
}
