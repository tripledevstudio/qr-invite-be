import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import configuration from './config/configuration';
import { DynamoModule } from './dynamo/dynamo.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CheckInModule } from './checkin/checkin.module';
import { PaginationModule } from './common/pagination/pagination.module';
import { StoreModule } from './store/store.module';
import { PaymentModule } from './payment/payment.module';
import { AdminModule } from './admin/admin.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    AdminModule,
    UserModule,
    PaymentModule,
    StoreModule,
    ServiceModule,
    CheckInModule,
    PaginationModule,
    UploadModule,
    DynamoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  // constructor(private readonly dynamoDBService: DynamoDBService) {}

  onModuleInit() {
    // initAwsHelper(this.dynamoDBService);
  }
}
