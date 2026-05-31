export class CheckIn {
  id?: string;
  user_id: string;
  store_id: string;
  timestamp: string;

  constructor(partial: Partial<CheckIn>) {
    Object.assign(this, partial);
    if (!this.timestamp) this.timestamp = new Date().toISOString();
  }
}