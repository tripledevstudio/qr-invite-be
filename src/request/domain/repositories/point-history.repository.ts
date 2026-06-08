import { PointHistory } from '../entities/point-history.entity';

export const POINT_HISTORY_REPOSITORY_TOKEN = 'POINT_HISTORY_REPOSITORY_TOKEN';

export interface PointHistoryRepository {
  create(history: PointHistory): Promise<PointHistory>;
  findById(id: string): Promise<PointHistory | null>;
  findByUserId(userId: string): Promise<PointHistory[]>;
}