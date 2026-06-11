import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { DynamoAdminRepository } from './infrastructure/dynamo/dynamo-admin.repository';
import { ADMIN_REPOSITORY_TOKEN } from './domain/repositories/admin.repository';
import { DynamoModule } from '../dynamo/dynamo.module';
import {
  CreateAdminUseCase,
  LoginAdminUseCase,
  GetAdminByIdUseCase,
  SwitchStoreUseCase,
  UpdateAdminUseCase,
} from './application/use-cases';

@Module({
  imports: [JwtModule.register({}), DynamoModule],
  controllers: [AdminController],
  providers: [
    CreateAdminUseCase,
    LoginAdminUseCase,
    GetAdminByIdUseCase,
    SwitchStoreUseCase,
    UpdateAdminUseCase,
    {
      provide: ADMIN_REPOSITORY_TOKEN,
      useClass: DynamoAdminRepository,
    },
  ],
  exports: [ADMIN_REPOSITORY_TOKEN],
})
export class AdminModule {}
