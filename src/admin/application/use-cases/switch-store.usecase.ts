import { Injectable, Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ADMIN_REPOSITORY_TOKEN } from '../../domain/repositories/admin.repository';
import type { AdminRepository } from '../../domain/repositories/admin.repository';
import { SwitchStoreDto } from '../../dto/switch-store.dto';
import { Admin } from '../../domain/entities/admin.entity';

@Injectable()
export class SwitchStoreUseCase {
  constructor(
    @Inject(ADMIN_REPOSITORY_TOKEN)
    private readonly adminRepository: AdminRepository,
  ) {}

  async execute(adminId: string, dto: SwitchStoreDto): Promise<Admin> {
    const admin = await this.adminRepository.findById(adminId);
    if (!admin) throw new BadRequestException('Admin not found');

    const { store_id } = dto;
    if (!admin.store_ids?.includes(store_id)) {
      throw new ForbiddenException('Admin does not have access to this store');
    }

    if (!admin.id) throw new BadRequestException('Admin ID is missing');

    // Update current_store_id
    const updatedAdmin = await this.adminRepository.update(admin.id, {
      current_store_id: store_id,
    });
    return updatedAdmin;
  }
}
