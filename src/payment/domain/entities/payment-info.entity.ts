export class PaymentInfo {
  id!: string; // userId is stored in id
  bank_code?: string;
  account_number?: string;
  account_holder_name?: string;
  qr_image_url?: string;
  created_at: string;
  updated_at: string;

  constructor(partial: Partial<PaymentInfo>) {
    this.created_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
    Object.assign(this, partial);
  }
}
