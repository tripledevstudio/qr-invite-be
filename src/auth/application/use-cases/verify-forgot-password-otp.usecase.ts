import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { VerifyOtpDto } from '../../dto/verify-otp.dto';
import { User } from '../../../user/domain/entities/user.entity';

@Injectable()
export class VerifyForgotPasswordOtpUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(verifyOtpDto: VerifyOtpDto) {
    const { email, phone_number, otp } = verifyOtpDto;

    if (!email && !phone_number) {
      throw new BadRequestException('Email or phone number is required');
    }

    let user: User | null = null;
    if (email) {
      user = await this.userRepository.findByEmail(email);
    } else if (phone_number) {
      user = await this.userRepository.findByPhone(phone_number);
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.forgot_password_otp || user.forgot_password_otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (
      !user.forgot_password_otp_expires_at ||
      new Date(user.forgot_password_otp_expires_at) < new Date()
    ) {
      throw new BadRequestException('Expired OTP');
    }

    return { message: 'OTP verified successfully' };
  }
}