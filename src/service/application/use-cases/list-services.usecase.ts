import { Injectable, Inject } from '@nestjs/common';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { SERVICE_REPOSITORY_TOKEN } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class ListServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY_TOKEN) private readonly repository: ServiceRepository,
  ) {}

  async execute(storeId?: string): Promise<Service[]> {
    const services = await this.repository.findAll();
    if (storeId) {
      return services.filter(service => service.store_id === storeId);
    }
    return services;
  }
}