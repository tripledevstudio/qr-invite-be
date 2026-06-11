import { Injectable, Inject } from '@nestjs/common';
import type { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';
import { CheckInFilterDto } from '../../dto/check-in-filter.dto';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';

@Injectable()
export class GetLogsUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly repo: CheckInRepository,
    @Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository,
  ) {}

  async execute(filter: CheckInFilterDto): Promise<any[]> {
    const logs = await this.repo.getLogs(filter);
    const enriched = await Promise.all(
      logs.map(async (log) => {
        const store = await this.storeRepo.findOne(log.store_id ?? '');
        return {
          ...log,
          store: store ? { id: store.id, name: store.name } : null,
        };
      }),
    );
    return enriched;
  }
}
