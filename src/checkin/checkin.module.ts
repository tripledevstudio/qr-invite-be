import { Module } from '@nestjs/common';
import { CheckInController } from './checkin.controller';
import { DynamoModule } from '../dynamo/dynamo.module';
import { CHECK_IN_REPOSITORY_TOKEN } from './domain/repositories/check-in.repository';
import { DynamoCheckInRepository } from './infrastructure/dynamo/dynamo-check-in.repository';
import { CheckInUseCase } from './application/use-cases/check-in.usecase';
import { GetLogsUseCase } from './application/use-cases/get-logs.usecase';

@Module({
  imports: [DynamoModule],
  controllers: [CheckInController],
  providers: [
    { provide: CHECK_IN_REPOSITORY_TOKEN, useClass: DynamoCheckInRepository },
    CheckInUseCase,
    GetLogsUseCase,
  ],
  exports: [],
})
export class CheckInModule {}