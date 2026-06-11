import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from '../../dto/register.dto';
import { REQUEST_REPOSITORY_TOKEN } from '../../../request/domain/repositories/request.repository';
import type { RequestRepository } from '../../../request/domain/repositories/request.repository';
import { Request, RequestType } from '../../../request/domain/entities/request.entity';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { User } from '../../../user/domain/entities/user.entity';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(REQUEST_REPOSITORY_TOKEN)
    private readonly requestRepository: RequestRepository,
  ) {}

  async execute(registerDto: RegisterDto) {
    const { email, phone_number, password, ...rest } = registerDto;
    const storeId =
      (registerDto as any).store_id ||
      ((registerDto as any).store_ids && (registerDto as any).store_ids.length > 0
        ? (registerDto as any).store_ids[0]
        : undefined);

    if (!email && !phone_number) {
      throw new BadRequestException('Email or phone number is required');
    }

    if (email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) throw new BadRequestException('Email already exists');
    }

    if (phone_number) {
      const existingUser = await this.userRepository.findByPhone(phone_number);
      if (existingUser) throw new BadRequestException('Phone number already exists');
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

    const userStoreIds = (registerDto as any).store_ids
      ? (registerDto as any).store_ids
      : storeId
        ? [storeId]
        : undefined;

    const user = new User({
      ...rest,
      email,
      phone_number,
      password: hashedPassword,
      invite_code: inviteCode,
      is_verify: false,
      ...(userStoreIds ? { store_ids: userStoreIds } : {}),
    });

    const createdUser = await this.userRepository.create(user);
    await this.requestRepository.create(
      new Request({
        user_id: createdUser.id,
        type: RequestType.REGISTER,
        ...(storeId ? { store_id: storeId } : {}),
      }),
    );

    return { message: 'User registered successfully. Please wait for admin approval.' };
  }
}
