import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { REQUEST_REPOSITORY_TOKEN } from '../../domain/repositories/request.repository';
import type { RequestRepository } from '../../domain/repositories/request.repository';
import { Request, RequestStatus, RequestType } from '../../domain/entities/request.entity';
import { USER_REPOSITORY_TOKEN } from '../../../user/domain/repositories/user.repository';
import type { UserRepository } from '../../../user/domain/repositories/user.repository';
import { POINT_HISTORY_REPOSITORY_TOKEN } from '../../domain/repositories/point-history.repository';
import type { PointHistoryRepository } from '../../domain/repositories/point-history.repository';
import { PointHistory } from '../../domain/entities/point-history.entity';
import { ApproveRequestDto } from '../../dto/approve-request.dto';
import { STORE_USER_REPOSITORY_TOKEN } from '../../../store/domain/repositories/store-user.repository';
import type { StoreUserRepository } from '../../../store/domain/repositories/store-user.repository';
import { StoreUser } from '../../../store/domain/entities/store-user.entity';

@Injectable()
export class ApproveRequestUseCase {
  constructor(
    @Inject(REQUEST_REPOSITORY_TOKEN)
    private readonly requestRepository: RequestRepository,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(POINT_HISTORY_REPOSITORY_TOKEN)
    private readonly pointHistoryRepository: PointHistoryRepository,
    @Inject(STORE_USER_REPOSITORY_TOKEN)
    private readonly storeUserRepository: StoreUserRepository,
  ) { }

  async execute(dto: ApproveRequestDto) {
    const request = await this.requestRepository.findById(dto.request_id);
    if (!request) throw new NotFoundException('Request not found');

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Request already processed');
    }

    const updates: Partial<Request> = {
      status: dto.approved ? RequestStatus.APPROVED : RequestStatus.REJECTED,
    };

    // If approval for registration, mark user as verified and add mappings
    if (dto.approved && request.type === RequestType.REGISTER) {
      await this.userRepository.update(request.user_id, { is_verify: true });

      const user = await this.userRepository.findById(request.user_id);
      if (user && user.store_ids && user.store_ids.length > 0) {
        for (const storeId of user.store_ids) {
          await this.storeUserRepository.create(
            new StoreUser({
              store_id: storeId,
              user_id: user.id,
              name: user.name,
              avatar: user.avatar,
              is_verify: true,
              role: user.role,
            })
          );
        }
      }
    }

    // If approval for withdrawal, deduct points and log history
    if (dto.approved && request.type === RequestType.WITHDRAW) {
      if (request.amount === undefined) {
        throw new BadRequestException('Withdrawal amount missing');
      }

      const user = await this.userRepository.findById(request.user_id);
      if (!user) throw new NotFoundException('User not found');

      const currentPoints = user.bonus_current ?? 0;
      if (currentPoints < request.amount) {
        throw new BadRequestException('Insufficient points for withdrawal');
      }

      // Deduct points
      await this.userRepository.update(user.id, {
        bonus_current: currentPoints - request.amount,
      });

      // Log point history
      const history = new PointHistory({
        user_id: user.id,
        store_id: request.store_id!,
        amount: -request.amount,
        type: 'WITHDRAWAL',
      });

      await this.pointHistoryRepository.create(history);
    }

    // Persist request status change
    return this.requestRepository.update(request.id!, updates);
  }
}