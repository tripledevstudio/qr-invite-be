import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { CreateAdminUseCase } from './application/use-cases/create-admin.usecase';
import { LoginAdminUseCase } from './application/use-cases/login-admin.usecase';
import { GetAdminByIdUseCase } from './application/use-cases/get-admin-by-id.usecase';
import { DynamoAdminRepository } from './infrastructure/dynamo/dynamo-admin.repository';
import { ADMIN_REPOSITORY_TOKEN } from './domain/repositories/admin.repository';
import { DynamoModule } from '../dynamo/dynamo.module';

@Module({
  imports: [JwtModule.register({}), DynamoModule],
  controllers: [AdminController],
  providers: [
    CreateAdminUseCase,
    LoginAdminUseCase,
    GetAdminByIdUseCase,
    {
      provide: ADMIN_REPOSITORY_TOKEN,
      useClass: DynamoAdminRepository,
    },
  ],
  exports: [ADMIN_REPOSITORY_TOKEN],
})
export class AdminModule {}