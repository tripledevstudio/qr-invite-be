import { Module } from '@nestjs/common';
import { CheckInController } from './checkin.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { CHECK_IN_REPOSITORY_TOKEN } from './domain/repositories/check-in.repository';
import { DynamoCheckInRepository } from './infrastructure/dynamo/dynamo-check-in.repository';
import { CheckInUseCase } from './application/use-cases/check-in.usecase';
import { GetLogsUseCase } from './application/use-cases/get-logs.usecase';
import { ProcessCheckInUseCase } from './application/use-cases/process-check-in.usecase';
import { GetPointHistoriesUseCase } from './application/use-cases/get-point-histories.usecase';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';
import { RequestModule } from '../request/request.module';

@Module({
  imports: [DynamoModule, UserModule, StoreModule, RequestModule],
  controllers: [CheckInController],
  providers: [
    { provide: CHECK_IN_REPOSITORY_TOKEN, useClass: DynamoCheckInRepository },
    CheckInUseCase,
    GetLogsUseCase,
    ProcessCheckInUseCase,
    GetPointHistoriesUseCase,
  ],
  exports: [],
})
export class CheckInModule {}
