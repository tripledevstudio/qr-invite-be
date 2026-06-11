import { Injectable, Inject } from '@nestjs/common';
import { Admin } from '../../domain/entities/admin.entity';
import { ADMIN_REPOSITORY_TOKEN } from '../../domain/repositories/admin.repository';
import type { AdminRepository } from '../../domain/repositories/admin.repository';

@Injectable()
export class GetAdminByIdUseCase {
  constructor(
    @Inject(ADMIN_REPOSITORY_TOKEN)
    private readonly adminRepository: AdminRepository
  ) {}

  async execute(id: string): Promise<Admin | null> {
    return this.adminRepository.findById(id);
  }
}
