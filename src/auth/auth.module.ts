import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RegisterUseCase } from './application/use-cases/register.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.usecase';
import { VerifyEmailUseCase } from './application/use-cases/verify-email.usecase';
import { ForgotPasswordUseCase } from './application/use-cases/forgot-password.usecase';
import { VerifyForgotPasswordOtpUseCase } from './application/use-cases/verify-forgot-password-otp.usecase';
import { ResetPasswordUseCase } from './application/use-cases/reset-password.usecase';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    StoreModule,
  ],
  providers: [
  RegisterUseCase,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
  VerifyEmailUseCase,
  ForgotPasswordUseCase,
  VerifyForgotPasswordOtpUseCase,
  ResetPasswordUseCase,
  JwtStrategy,
  JwtAuthGuard,
],
  controllers: [AuthController],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
