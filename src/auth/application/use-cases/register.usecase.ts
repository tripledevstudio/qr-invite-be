import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { RegisterDto } from '../../dto/register.dto';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { User } from '../../../user/domain/entities/user.entity';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN)
    private readonly storeRepository: StoreRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(registerDto: RegisterDto) {
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

    // Check for duplicate user_name if provided
    if ((registerDto as any).user_name) {
      const existingUser = await this.userRepository.findByUserName((registerDto as any).user_name);
      if (existingUser) {
        throw new BadRequestException('User name already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique default invite_code: REF- and 8 random digits
    let inviteCode = '';
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 20) {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000);
      inviteCode = `REF-${randomNum}`;
      const existingUser = await this.userRepository.findByInviteCode(inviteCode);
      if (!existingUser) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new BadRequestException('Could not generate a unique invite code. Please try again.');
    }

    const user = new User({
      ...rest,
      email,
      phone_number,
      password: hashedPassword,
      invite_code: inviteCode,
      is_verify: !!email ? false : true,
    });

    const createdUser = await this.userRepository.create(user);

    if (rest.store_ids && rest.store_ids.length > 0) {
      for (const store_id of rest.store_ids) {
        try {
          const store = await this.storeRepository.findOne(store_id);
          const collaboratorIds = Array.isArray(store.collaborator_ids) ? store.collaborator_ids : [];
          if (!collaboratorIds.includes(createdUser.id!)) {
            collaboratorIds.push(createdUser.id!);
            await this.storeRepository.update(store_id, {
              collaborator_ids: collaboratorIds,
              collaborator_count: collaboratorIds.length,
            });
          }
        } catch (error) {
          console.warn(`Store not found or error updating store ${store_id}:`, error);
        }
      }
    }

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

  private async sendVerificationEmail(email: string, verificationUrl: string) {
    const transporter = this.createTransport();

    await transporter.sendMail({
      from: '"TripleDevs Studio" <noreply@tripledevstudio.com>',
      to: email,
      subject: 'Verify your account',
      html: `<p>Please click the button below to verify your account:</p>
             <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>`,
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