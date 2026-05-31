import { Injectable, Inject } from '@nestjs/common';
import type { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';
import { CheckInFilterDto } from '../../dto/check-in-filter.dto';
import { CheckIn } from '../../domain/entities/check-in.entity';

@Injectable()
export class GetLogsUseCase {
  constructor(@Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly repo: CheckInRepository) {}

  async execute(filter: CheckInFilterDto): Promise<CheckIn[]> {
    return this.repo.getLogs(filter);
  }
}