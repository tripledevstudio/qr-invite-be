import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { SERVICE_REPOSITORY_TOKEN } from '../../domain/repositories/service.repository';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY_TOKEN) private readonly repository: ServiceRepository,
  ) {}

  async execute(id: string): Promise<Service> {
    const service = await this.repository.findOne(id);
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }
}