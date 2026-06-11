import { Inject, Injectable } from '@nestjs/common';
import type { PaymentInfoRepository } from '../../domain/repositories/payment-info.repository';
import { PAYMENT_INFO_REPOSITORY_TOKEN } from '../../domain/repositories/payment-info.repository';
import { UpdatePaymentInfoDto } from '../../dto/update-payment-info.dto';

@Injectable()
export class UpdatePaymentInfoUseCase {
  constructor(
    @Inject(PAYMENT_INFO_REPOSITORY_TOKEN)
    private readonly repo: PaymentInfoRepository,
  ) {}

  async execute(userId: string, dto: UpdatePaymentInfoDto) {
    return this.repo.update(userId, dto);
  }
}
