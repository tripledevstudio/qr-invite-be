import { Request } from '../entities/request.entity';

export const REQUEST_REPOSITORY_TOKEN = 'REQUEST_REPOSITORY_TOKEN';

export interface RequestRepository {
  create(request: Request): Promise<Request>;
  findById(id: string): Promise<Request | null>;
  update(id: string, updates: Partial<Request>): Promise<Request | null>;
  findByUserId(userId: string): Promise<Request[]>;
  findAll(filters?: {
    type?: string;
    status?: string;
    store_id?: string;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
  }): Promise<Request[]>;
}