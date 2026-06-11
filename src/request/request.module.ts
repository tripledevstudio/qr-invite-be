import { Module } from '@nestjs/common';
import { DynamoRequestRepository } from './infrastructure/dynamo/dynamo-request.repository';
import { DynamoPointHistoryRepository } from './infrastructure/dynamo/dynamo-point-history.repository';
import { REQUEST_REPOSITORY_TOKEN } from './domain/repositories/request.repository';
import { POINT_HISTORY_REPOSITORY_TOKEN } from './domain/repositories/point-history.repository';
import { ApproveRequestUseCase } from './application/use-cases/approve-request.usecase';
import { ListRequestsUseCase } from './application/use-cases/list-requests.usecase';
import { RequestController } from './request.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [DynamoModule, UserModule, StoreModule],
  controllers: [RequestController],
  providers: [
    {
      provide: REQUEST_REPOSITORY_TOKEN,
      useClass: DynamoRequestRepository,
    },
    {
      provide: POINT_HISTORY_REPOSITORY_TOKEN,
      useClass: DynamoPointHistoryRepository,
    },
    ApproveRequestUseCase,
    ListRequestsUseCase,
  ],
  exports: [
    REQUEST_REPOSITORY_TOKEN,
    POINT_HISTORY_REPOSITORY_TOKEN,
    ApproveRequestUseCase,
    ListRequestsUseCase
  ],
})
export class RequestModule {}
