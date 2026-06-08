import { Injectable, Inject } from '@nestjs/common';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { SERVICE_REPOSITORY_TOKEN } from '../../domain/repositories/service.repository';
import { UpdateServiceDto } from '../../dto/update-service.dto';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY_TOKEN) private readonly repository: ServiceRepository,
  ) {}

  async execute(id: string, dto: UpdateServiceDto, storeId?: string): Promise<Service> {
    const entity = { ...dto, ...(storeId ? { store_id: storeId } : {}) };
    return this.repository.update(id, entity);
  }
}