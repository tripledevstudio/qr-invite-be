import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { USER_REPOSITORY_TOKEN } from '../user/domain/repositories/user.repository';
import type { UserRepository } from '../user/domain/repositories/user.repository';
import { User } from '../user/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, phone_number, password, ...rest } = registerDto;

    if (!email && !phone_number) {
      throw new BadRequestException('Email or phone number is required');
    }

    if (email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) throw new BadRequestException('Email already exists');
    }

    if (phone_number) {
      const existingUser = await this.userRepository.findByPhone(phone_number);
      if (existingUser)
        throw new BadRequestException('Phone number already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique default ref_code: REF- and 8 random digits
    let refCode = '';
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 20) {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000);
      refCode = `REF-${randomNum}`;
      const existingUser = await this.userRepository.findByRefCode(refCode);
      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new BadRequestException('Could not generate a unique referral code. Please try again.');
    }

    const user = new User({
      ...rest,
      email,
      phone_number,
      password: hashedPassword,
      ref_code: refCode,
    });

    const createdUser = await this.userRepository.create(user);

    if (createdUser.email) {
      const verificationToken = this.jwtService.sign(
        { sub: createdUser.id },
        { secret: process.env.JWT_VERIFY_SECRET || 'verifySecret', expiresIn: '1d' },
      );
      const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/auth/verify/${verificationToken}`;
      await this.sendVerificationEmail(createdUser.email, verificationUrl);
    }

    return { message: 'User registered successfully. Please check your email to verify.' };
  }

  async login(loginDto: LoginDto) {
    const { email, phone_number, password } = loginDto;

    if (!email && !phone_number) {
      throw new BadRequestException('Email or phone number is required');
    }

    let user: User | null = null;

    if (email) {
      user = await this.userRepository.findByEmail(email);
    } else if (phone_number) {
      user = await this.userRepository.findByPhone(phone_number);
    }

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async logout() {
    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refresh_token } = refreshTokenDto;
    try {
      const payload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      });
      const user = {
        id: payload.sub,
        email: payload.email,
        phone_number: payload.phone_number,
        role: payload.role,
      };
      return this.generateTokens(user as any);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFY_SECRET || 'verifySecret',
      });
      const user = await this.userRepository.findById(payload.sub);
      if (!user) throw new NotFoundException('User not found');
      
      await this.userRepository.update(user.id, { is_verify: true });
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
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

  async verifyForgotPasswordOtp(verifyOtpDto: VerifyOtpDto) {
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
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

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      forgot_password_otp: '',
      forgot_password_otp_expires_at: '',
    });

    return { message: 'Password reset successfully' };
  }

  private async sendVerificationEmail(email: string, verificationUrl: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"TripleDevs Studio" <noreply@tripledevstudio.com>',
      to: email,
      subject: 'Verify your account',
      html: `<p>Please click the button below to verify your account:</p>
             <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>`,
    });
  }

  private async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

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

  private generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
    };

    return {
      message: 'Success',
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'secretKey',
        expiresIn: '15m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
        expiresIn: '7d',
      }),
    };
  }
}
