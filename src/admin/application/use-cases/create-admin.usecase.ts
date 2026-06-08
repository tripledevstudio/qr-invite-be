import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from '../../dto/create-admin.dto';
import { Admin } from '../../domain/entities/admin.entity';
import { ADMIN_REPOSITORY_TOKEN } from '../../domain/repositories/admin.repository';
import type { AdminRepository } from '../../domain/repositories/admin.repository';

@Injectable()
export class CreateAdminUseCase {
  constructor(
    @Inject(ADMIN_REPOSITORY_TOKEN)
    private readonly adminRepository: AdminRepository,
  ) {}

  async execute(createDto: CreateAdminDto) {
    const { email, phone_number, password, store_id } = createDto;

    if (!email && !phone_number) {
      throw new BadRequestException('Email or phone number is required');
    }

    if (email) {
      const exists = await this.adminRepository.findByEmail(email);
      if (exists) throw new BadRequestException('Email already used');
    }

    if (phone_number) {
      const exists = await this.adminRepository.findByPhone(phone_number);
      if (exists) throw new BadRequestException('Phone number already used');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin();
    admin.email = email;
    admin.phone_number = phone_number;
    admin.password = hashedPassword;
    admin.store_id = store_id;

    return this.adminRepository.create(admin);
  }
}