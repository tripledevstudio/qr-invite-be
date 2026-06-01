import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
 
import { DynamoModule } from '../dynamo/dynamo.module';
import { PaymentModule } from '../payment/payment.module';
import { DynamoUserRepository } from './infrastructure/dynamo/dynamo-user.repository';
import { USER_REPOSITORY_TOKEN } from './domain/repositories/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { GetUserUseCase } from './application/use-cases/get-user.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { GetUserByRefCodeUseCase } from './application/use-cases/get-user-by-ref-code.usecase';

@Module({
  imports: [DynamoModule, PaymentModule],
  providers: [
    { provide: USER_REPOSITORY_TOKEN, useClass: DynamoUserRepository },
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUserByRefCodeUseCase,
  ],
  controllers: [UserController],
  exports: [USER_REPOSITORY_TOKEN],
})
export class UserModule {}
