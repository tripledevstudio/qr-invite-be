import { Injectable, Inject } from '@nestjs/common';
import { REQUEST_REPOSITORY_TOKEN } from '../../domain/repositories/request.repository';
import type { RequestRepository } from '../../domain/repositories/request.repository';
import { ListRequestsDto } from '../../dto/list-requests.dto';

@Injectable()
export class ListRequestsUseCase {
  constructor(
    @Inject(REQUEST_REPOSITORY_TOKEN)
    private readonly requestRepository: RequestRepository
  ) {}

  async execute(filters: ListRequestsDto) {
    return this.requestRepository.findAll({
      type: filters.type,
      status: filters.status,
      store_id: filters.store_id,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order
    });
  }
}
