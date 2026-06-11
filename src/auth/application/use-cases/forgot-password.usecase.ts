import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { ForgotPasswordDto } from '../../dto/forgot-password.dto';
import { User } from '../../../user/domain/entities/user.entity';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(forgotPasswordDto: ForgotPasswordDto) {
    const { email, phone_number } = forgotPasswordDto;

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

    if (!user.email) {
      throw new BadRequestException('User does not have a registered email address');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await this.userRepository.update(user.id, {
      forgot_password_otp: otp,
      forgot_password_otp_expires_at: expiresAt,
    });

    await this.sendOtpEmail(user.email, otp);

    return { message: 'OTP sent to your email successfully' };
  }

  private async sendOtpEmail(email: string, otp: string) {
    const transporter = this.createTransport();

    await transporter.sendMail({
      from: '"TripleDevs Studio" <noreply@tripledevstudio.com>',
      to: email,
      subject: 'Reset your password',
      html: `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; padding: 20px; font-family: Helvetica, Arial, sans-serif;">
              <tr>
                  <td align="center">
                      <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                          <tr>
                              <td style="font-size: 24px; font-weight: bold; color: #333333; text-align: center; padding-bottom: 20px;">
                                  Security Verification Code
                              </td>
                          </tr>
                          <tr>
                              <td style="font-size: 16px; color: #666666; line-height: 1.5; text-align: center; padding-bottom: 30px;">
                                  Please use the following single-use verification code to complete your interaction. Do not share this authentication parameter with anyone.
                              </td>
                          </tr>
                          <tr>
                              <td align="center" style="padding-bottom: 30px;">
                                  <span style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 4px; background-color: #e6f2ff; padding: 12px 30px; border-radius: 6px; display: inline-block;">
                                      ${otp}
                                  </span>
                              </td>
                          </tr>
                          <tr>
                              <td style="font-size: 12px; color: #999999; text-align: center; border-top: 1px solid #eeeeee; padding-top: 20px;">
                                  This operational safety metric expires within 10 minutes. If you did not issue this verification request, disregard this message.
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>`,
    });
  }

  private createTransport() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
}
