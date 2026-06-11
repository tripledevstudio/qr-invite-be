export class PaymentInfo {
  id: string; // userId is stored in id
  bank_code?: string;
  account_number?: string;
  account_holder_name?: string;
  qr_image_url?: string;
  created_at: string;
  updated_at: string;

  constructor(partial: Partial<PaymentInfo>) {
    Object.assign(this, partial);
    if (!this.created_at) this.created_at = new Date().toISOString();
    if (!this.updated_at) this.updated_at = new Date().toISOString();
  }
}
