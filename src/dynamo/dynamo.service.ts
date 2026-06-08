import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { USER_TABLE_NAME, CHECK_IN_TABLE_NAME, STORE_TABLE_NAME, PAYMENT_INFO_TABLE_NAME, ADMIN_TABLE_NAME } from './constants';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const region = this.configService.get<string>('database.awsRegion');
    const accessKeyId = this.configService.get<string>(
      'database.awsAccessKeyId',
    );
    const secretAccessKey = this.configService.get<string>(
      'database.awsSecretAccessKey',
    );

    this.client = new DynamoDBClient({
      region: region || 'ap-southeast-1',
      credentials: {
        accessKeyId: accessKeyId || '',
        secretAccessKey: secretAccessKey || '',
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);

    await this.ensureTablesExist();
  }

  private async ensureTablesExist() {
    const tables = [USER_TABLE_NAME, CHECK_IN_TABLE_NAME, STORE_TABLE_NAME, PAYMENT_INFO_TABLE_NAME, ADMIN_TABLE_NAME];
    
    for (const tableName of tables) {
      try {
        await this.client.send(
          new DescribeTableCommand({ TableName: tableName }),
        );
      } catch (err: any) {
        if (
          err.name === 'ResourceNotFoundException' ||
          err.$metadata?.httpStatusCode === 404
        ) {
          // Default schema with 'id' as Partition Key for auto-provisioning
          await this.client.send(
            new CreateTableCommand({
              TableName: tableName,
              AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
              KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
              BillingMode: 'PAY_PER_REQUEST',
            }),
          );
        } else {
          throw err;
        }
      }
    }
  }

  getClient(): DynamoDBClient {
    return this.client;
  }

  getDocClient(): DynamoDBDocumentClient {
    return this.docClient;
  }
}
