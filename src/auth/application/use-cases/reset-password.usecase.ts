import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { User } from '../../../user/domain/entities/user.entity';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(resetPasswordDto: ResetPasswordDto) {
    const { email, phone_number, otp, new_password } = resetPasswordDto;

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

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await this.userRepository.update(user.id!, {
      password: hashedPassword,
      forgot_password_otp: '',
      forgot_password_otp_expires_at: '',
    });

    return { message: 'Password reset successfully' };
  }
}