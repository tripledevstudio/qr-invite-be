import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { GetPaymentInfoUseCase } from './application/use-cases/get-payment-info.usecase';
import { UpdatePaymentInfoUseCase } from './application/use-cases/update-payment-info.usecase';
import { UpdatePaymentInfoDto } from './dto/update-payment-info.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/:userId/payment')
export class PaymentController {
  constructor(
    private readonly getPaymentInfoUseCase: GetPaymentInfoUseCase,
    private readonly updatePaymentInfoUseCase: UpdatePaymentInfoUseCase,
  ) {}

  @Get()
  async get(@Param('userId') userId: string) {
    return this.getPaymentInfoUseCase.execute(userId);
  }

  @Patch()
  async update(@Param('userId') userId: string, @Body() dto: UpdatePaymentInfoDto) {
    return this.updatePaymentInfoUseCase.execute(userId, dto);
  }
}