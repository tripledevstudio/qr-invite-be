import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { CreateServiceUseCase } from './application/use-cases/create-service.usecase';
import { UpdateServiceUseCase } from './application/use-cases/update-service.usecase';
import { GetServiceUseCase } from './application/use-cases/get-service.usecase';
import { ListServicesUseCase } from './application/use-cases/list-services.usecase';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.usecase';
import { DynamoServiceRepository } from './infrastructure/dynamo/dynamo-service.repository';
import { SERVICE_REPOSITORY_TOKEN } from './domain/repositories/service.repository';
import { DynamoModule } from '../dynamo/dynamo.module';

@Module({
  imports: [DynamoModule],
  controllers: [ServiceController],
  providers: [
    {
      provide: SERVICE_REPOSITORY_TOKEN,
      useClass: DynamoServiceRepository,
    },
    CreateServiceUseCase,
    UpdateServiceUseCase,
    GetServiceUseCase,
    ListServicesUseCase,
    DeleteServiceUseCase,
  ]
})
export class ServiceModule {}
