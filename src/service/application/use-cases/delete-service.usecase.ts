import { Injectable, Inject } from '@nestjs/common';
import type { ServiceRepository } from '../../domain/repositories/service.repository';
import { SERVICE_REPOSITORY_TOKEN } from '../../domain/repositories/service.repository';

@Injectable()
export class DeleteServiceUseCase {
  constructor(@Inject(SERVICE_REPOSITORY_TOKEN) private readonly repository: ServiceRepository) {}

  async execute(id: string): Promise<{ deleted: boolean }> {
    return this.repository.remove(id);
  }
}
