import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UpdateAdminDto } from '../../dto/update-admin.dto';
import { ADMIN_REPOSITORY_TOKEN } from '../../domain/repositories/admin.repository';
import type { AdminRepository } from '../../domain/repositories/admin.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateAdminUseCase {
    constructor(
        @Inject(ADMIN_REPOSITORY_TOKEN)
        private readonly adminRepository: AdminRepository,
    ) { }

    async execute(id: string, dto: UpdateAdminDto) {
        if (!id) {
            throw new BadRequestException('Admin id is required');
        }

        const updateData: Partial<Record<keyof UpdateAdminDto, any>> = { ...dto };

        // Transformations
        if (dto.user_name) {
            updateData.user_name = dto.user_name.trim().toUpperCase();
        }

        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        // Pass the transformed data to repository
        return this.adminRepository.update(id, updateData);
    }
}