import { Inject, Injectable } from '@nestjs/common';
import { PaymentInfo } from '../../domain/entities/payment-info.entity';
import type { PaymentInfoRepository } from '../../domain/repositories/payment-info.repository';
import { PAYMENT_INFO_REPOSITORY_TOKEN } from '../../domain/repositories/payment-info.repository';

@Injectable()
export class GetPaymentInfoUseCase {
  constructor(
    @Inject(PAYMENT_INFO_REPOSITORY_TOKEN)
    private readonly repo: PaymentInfoRepository,
  ) {}

  async execute(userId: string): Promise<PaymentInfo | null> {
    return this.repo.getByUserId(userId);
  }
}