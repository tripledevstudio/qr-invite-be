import { Injectable, Inject } from '@nestjs/common';
import type { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';

@Injectable()
export class DeleteCheckInUseCase {
  constructor(@Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly repo: CheckInRepository) {}

  async execute(id: string): Promise<{ deleted: boolean }> {
    return this.repo.remove(id);
  }
}