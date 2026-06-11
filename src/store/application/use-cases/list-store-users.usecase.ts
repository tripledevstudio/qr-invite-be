import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { STORE_USER_REPOSITORY_TOKEN } from '../../domain/repositories/store-user.repository';
import type { StoreUserRepository } from '../../domain/repositories/store-user.repository';
import { StoreUser } from '../../domain/entities/store-user.entity';
import { ListStoreUsersDto } from '../../dto/list-store-users.dto';
import { PaginationService } from '../../../common/pagination/pagination.service';
import { PaginationResponse } from '../../../common/pagination/pagination-response.interface';

@Injectable()
export class ListStoreUsersUseCase {
  constructor(
    @Inject(STORE_USER_REPOSITORY_TOKEN)
    private readonly storeUserRepository: StoreUserRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async execute(storeId: string, query: ListStoreUsersDto): Promise<PaginationResponse<StoreUser>> {
    // Verify store existence could be added, but we assume valid storeId
    const users = await this.storeUserRepository.findByStoreId(storeId);
    if (!users) {
      throw new NotFoundException('Store users not found');
    }

    let filtered = [...users];

    // Date range filtering
    let start: Date | null = null;
    let end: Date | null = null;

    if (query.start_date || query.end_date) {
      if (query.start_date) {
        start = new Date(query.start_date);
      }
      if (query.end_date) {
        end = new Date(query.end_date);
      }
    } else {
      // default to current month
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    if (start || end) {
      filtered = filtered.filter((u) => {
        if (!u.created_at) return false;
        const uDate = new Date(u.created_at);
        if (start && uDate < start) return false;
        if (end && uDate > end) return false;
        return true;
      });
    }

    // Search by user name (case insensitive)
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter((u) => u.name && u.name.toLowerCase().includes(searchLower));
    }

    // Sorting
    const sortBy = query.sort_by || 'created_at';
    const order = query.order || 'desc';

    filtered.sort((a, b) => {
      let valA = (a as any)[sortBy];
      let valB = (b as any)[sortBy];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (valA < valB) return order === 'asc' ? -1 : 1;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = query.page ? Number(query.page) : 1;
    const pageSize = query.page_size ? Number(query.page_size) : 10;
    return this.paginationService.paginate(filtered, page, pageSize);
  }
}
