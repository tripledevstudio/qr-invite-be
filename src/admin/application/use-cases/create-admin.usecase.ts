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
    const { user_name, email, phone_number, password, store_id } = createDto;

    if (!user_name) {
      throw new BadRequestException('User name is required');
    }

    const exists = await this.adminRepository.findByUserName(user_name);
    if (exists) throw new BadRequestException('User name already used');

    if (email) {
      const emailExists = await this.adminRepository.findByEmail(email);
      if (emailExists) throw new BadRequestException('Email already used');
    }

    if (phone_number) {
      const phoneExists = await this.adminRepository.findByPhone(phone_number);
      if (phoneExists) throw new BadRequestException('Phone number already used');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin();
    admin.user_name = user_name;
    admin.email = email;
    admin.phone_number = phone_number;
    admin.password = hashedPassword;
    admin.store_id = store_id;

    return this.adminRepository.create(admin);
  }
}