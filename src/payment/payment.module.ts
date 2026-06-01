import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { DynamoPaymentInfoRepository } from './infrastructure/dynamo/dynamo-payment-info.repository';
import { PAYMENT_INFO_REPOSITORY_TOKEN } from './domain/repositories/payment-info.repository';
import { GetPaymentInfoUseCase } from './application/use-cases/get-payment-info.usecase';
import { UpdatePaymentInfoUseCase } from './application/use-cases/update-payment-info.usecase';

@Module({
  imports: [DynamoModule],
  providers: [
    { provide: PAYMENT_INFO_REPOSITORY_TOKEN, useClass: DynamoPaymentInfoRepository },
    GetPaymentInfoUseCase,
    UpdatePaymentInfoUseCase,
  ],
  controllers: [PaymentController],
  exports: [PAYMENT_INFO_REPOSITORY_TOKEN, GetPaymentInfoUseCase],
})
export class PaymentModule {}
