import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { GetUserUseCase } from './application/use-cases/get-user.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { GetPaymentInfoUseCase } from '../payment/application/use-cases/get-payment-info.usecase';
import { GetUserByRefCodeUseCase } from './application/use-cases/get-user-by-ref-code.usecase';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
  private readonly createUserUseCase: CreateUserUseCase,
  private readonly getUserUseCase: GetUserUseCase,
  private readonly updateUserUseCase: UpdateUserUseCase,
  private readonly deleteUserUseCase: DeleteUserUseCase,
  private readonly getPaymentInfoUseCase: GetPaymentInfoUseCase,
  private readonly getUserByRefCodeUseCase: GetUserByRefCodeUseCase,
  ) {}

  @Post()
  create(@Body() createDto: CreateUserDto) {
    return this.createUserUseCase.execute(createDto);
  }

  @Get('me')
  async me(@Req() req: any) {
    const { userId } = req.user;
    const user = await this.getUserUseCase.execute(userId);
    const paymentInfo = await this.getPaymentInfoUseCase.execute(userId);
    let bankInfo: string | null = null;
    if (paymentInfo?.bank_code && paymentInfo?.account_number) {
      const last4 = paymentInfo.account_number.slice(-4);
      bankInfo = `${paymentInfo.bank_code}-****${last4}`;
    }
    return {
      ...user,
      bank_info: bankInfo,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getUserUseCase.execute(id);
  }

  @Get('ref/:refCode')
  async getByRefCode(@Param('refCode') refCode: string) {
    const user = await this.getUserByRefCodeUseCase.execute(refCode);
    if (!user) return null;
    const { avatar, name, ref_code, rank } = user;
    return { avatar, name, ref_code, rank };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.updateUserUseCase.execute(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute(id);
    return { deleted: true };
  }
}
