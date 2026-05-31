import { Injectable } from '@nestjs/common';
import { PaginationResponse } from './pagination-response.interface';

/**
 * Helper service to calculate pagination metadata.
 * It works with in‑memory arrays (useful for simple repositories) or with any
 * collection that can be sliced, returning a `PaginationResponse`.
 *
 * For more complex data sources (e.g., TypeORM, Prisma, DynamoDB) you can
 * adapt the `paginate` method to accept a query builder and let the DB handle
 * the limit/offset. The public contract stays the same.
 */
@Injectable()
export class PaginationService {
  /**
   * Paginate an array of items.
   *
   * @param data      Full collection of items.
   * @param page      Requested page number (1‑based).
   * @param pageSize  Number of items per page.
   *
   * @returns PaginationResponse with sliced items and meta data.
   */
  paginate<T>(data: T[], page: number, pageSize: number): PaginationResponse<T> {
    const totalItems = data.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Clamp page number within valid range
    const safePage = Math.min(Math.max(page, 1), totalPages);

    const startIdx = (safePage - 1) * pageSize;
    const items = data.slice(startIdx, startIdx + pageSize);
    const hasReachedEnd = safePage >= totalPages;

  return {
    items,
    page: safePage,
    page_size: pageSize,
    total_items: totalItems,
    total_pages: totalPages,
    has_reached_end: hasReachedEnd,
  };
  }
}