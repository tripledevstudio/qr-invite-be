export class PointHistory {
  id?: string;
  user_id: string;
  store_id: string;
  amount: number;
  type: string;
  created_at?: Date;

  constructor(partial: Partial<PointHistory>) {
    Object.assign(this, partial);
  }
}