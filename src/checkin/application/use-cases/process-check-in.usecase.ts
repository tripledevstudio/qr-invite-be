import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CHECK_IN_REPOSITORY_TOKEN } from '../../domain/repositories/check-in.repository';
import type { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { STORE_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store.repository';
import type { StoreRepository } from '../../../store/domain/repositories/store.repository';
import { POINT_HISTORY_REPOSITORY_TOKEN } from '../../../request/domain/repositories/point-history.repository';
import type { PointHistoryRepository } from '../../../request/domain/repositories/point-history.repository';
import { ProcessCheckInDto } from '../../dto/process-checkin.dto';
import { CheckIn } from '../../domain/entities/check-in.entity';

@Injectable()
export class ProcessCheckInUseCase {
  constructor(
    @Inject(CHECK_IN_REPOSITORY_TOKEN) private readonly checkInRepo: CheckInRepository,
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepo: UserRepository,
    @Inject(STORE_REPOSITORY_TOKEN) private readonly storeRepo: StoreRepository,
    @Inject(POINT_HISTORY_REPOSITORY_TOKEN)
    private readonly pointHistoryRepo: PointHistoryRepository
  ) {}

  async execute(storeId: string, dto: ProcessCheckInDto): Promise<CheckIn> {
    // 1. Find store
    const store = await this.storeRepo.findOne(storeId);
    if (!store) throw new NotFoundException('Store not found');

    // 2. Find collaborator by invite_code
    const collaborator = await this.userRepo.findByInviteCode(dto.invite_code);
    if (!collaborator) throw new NotFoundException('Collaborator not found with given invite code');

    let pointsAwared = 0;
    const defaultCommission = store.default_commission ?? 10;

    // 3. Check if collaborator has ref_code
    if (collaborator.ref_code) {
      // Find the referrer
      const referrer = await this.userRepo.findByInviteCode(collaborator.ref_code);
      if (referrer && referrer.store_ids?.includes(store.id)) {
        // Calculate points
        pointsAwared = (defaultCommission * dto.order_amount) / 100;

        // Add points to referrer
        const newBonus = (referrer.bonus_current ?? 0) + pointsAwared;
        await this.userRepo.update(referrer.id, { bonus_current: newBonus });

        // Record point history
        await this.pointHistoryRepo.create({
          user_id: referrer.id,
          store_id: store.id,
          amount: pointsAwared,
          type: 'COMMISSION_FROM_REF',
          collaborator_id: collaborator.id,
          order_amount: dto.order_amount,
          status: 'IN',
        });
      }
    }

    // 4. Record transaction (check-in with order info)
    const discountAmount = pointsAwared;
    const finalAmount = dto.order_amount - discountAmount;

    const checkInRecord = new CheckIn({
      user_id: collaborator.id,
      store_id: store.id,
      order_amount: dto.order_amount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      points_awarded: pointsAwared
    });

    return this.checkInRepo.checkIn(checkInRecord);
  }
}
