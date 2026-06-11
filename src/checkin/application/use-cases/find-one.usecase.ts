import { Injectable, Inject } from '@nestjs/common';
import type { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';
import { CheckIn } from '../../domain/entities/check-in.entity';

@Injectable()
export class FindOneUseCase {
  constructor(@Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly repo: CheckInRepository) {}

  async execute(id: string): Promise<CheckIn | undefined> {
    return this.repo.findOne(id);
  }
}
