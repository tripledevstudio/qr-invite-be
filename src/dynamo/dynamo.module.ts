import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoDBService } from './dynamo.service';
import { DynamoRepository } from './dynamo.repository';

@Module({
  imports: [ConfigModule],
  providers: [DynamoDBService, DynamoRepository],
  exports: [DynamoDBService, DynamoRepository]
})
export class DynamoModule {}
