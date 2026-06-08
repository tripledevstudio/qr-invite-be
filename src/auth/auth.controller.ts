import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangeStoreDto } from './dto/change-store.dto';

import { RegisterUseCase } from './application/use-cases/register.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.usecase';
import { ForgotPasswordUseCase } from './application/use-cases/forgot-password.usecase';
import { VerifyForgotPasswordOtpUseCase } from './application/use-cases/verify-forgot-password-otp.usecase';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.usecase';
import { ChangeStoreUseCase } from './application/use-cases/change-store.usecase';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { UseGuards, Req } from '@nestjs/common';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyForgotPasswordOtpUseCase: VerifyForgotPasswordOtpUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly changeStoreUseCase: ChangeStoreUseCase,
  ) { }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.registerUseCase.execute(registerDto);
  }

  @Get('verify/:token')
  async verify(@Param('token') token: string) {
    return this.verifyEmailUseCase.execute(token);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return this.logoutUseCase.execute();
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(refreshTokenDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(forgotPasswordDto);
  }

  @Post('verify-forgot-password-otp')
  @HttpCode(HttpStatus.OK)
  verifyForgotPasswordOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.verifyForgotPasswordOtpUseCase.execute(verifyOtpDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(resetPasswordDto);
  }

  @Post('change-store')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  changeStore(@Req() req: any, @Body() changeStoreDto: ChangeStoreDto) {
    return this.changeStoreUseCase.execute(req.user.user_id, changeStoreDto.store_id);
  }
}
