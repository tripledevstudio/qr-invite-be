import { PaymentInfo } from '../entities/payment-info.entity';

export const PAYMENT_INFO_REPOSITORY_TOKEN = 'PAYMENT_INFO_REPOSITORY';

export interface PaymentInfoRepository {
  getByUserId(userId: string): Promise<PaymentInfo | null>;
  update(userId: string, data: Partial<PaymentInfo>): Promise<PaymentInfo>;
  delete(userId: string): Promise<void>;
}
