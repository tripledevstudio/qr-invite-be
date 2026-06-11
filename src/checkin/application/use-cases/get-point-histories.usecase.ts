import { Injectable, Inject } from '@nestjs/common';
import { POINT_HISTORY_REPOSITORY_TOKEN } from '../../../request/domain/repositories/point-history.repository';
import type { PointHistoryRepository } from '../../../request/domain/repositories/point-history.repository';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';

@Injectable()
export class GetPointHistoriesUseCase {
  constructor(
    @Inject(POINT_HISTORY_REPOSITORY_TOKEN)
    private readonly pointHistoryRepo: PointHistoryRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepo: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN)
    private readonly storeRepo: StoreRepository,
  ) {}

  async execute(userId: string, storeId?: string): Promise<any[]> {
    const histories = await this.pointHistoryRepo.findByUserId(userId);
    const filtered = storeId ? histories.filter((h) => h.store_id === storeId) : histories;

    const enriched = await Promise.all(
      filtered.map(async (h) => {
        const [user, store, collaborator] = await Promise.all([
          this.userRepo.findById(h.user_id),
          this.storeRepo.findOne(h.store_id ?? ''),
          h.collaborator_id ? this.userRepo.findById(h.collaborator_id) : Promise.resolve(null),
        ]);

        return {
          ...h,
          user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
          store: store ? { id: store.id, name: store.name } : null,
          collaborator: collaborator
            ? { id: collaborator.id, name: collaborator.name, avatar: collaborator.avatar }
            : null,
          is_income: (h.amount ?? 0) > 0,
        };
      }),
    );

    return enriched;
  }
}
