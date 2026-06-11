import { Injectable } from '@nestjs/common';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { Admin } from '../../domain/entities/admin.entity';
import { AdminRepository } from '../../domain/repositories/admin.repository';
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { ADMIN_TABLE_NAME } from '../../../dynamo/constants';

@Injectable()
export class DynamoAdminRepository implements AdminRepository {
  private readonly tableName = ADMIN_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async create(admin: Admin): Promise<Admin> {
    const item = { ...admin, id: admin.id ?? randomUUID() };
    await this.dynamoRepository.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findById(id: string): Promise<Admin | null> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    return (result.Item as Admin) ?? null;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
      }),
    );
    return (result.Items?.[0] as Admin) ?? null;
  }

  async findByPhone(phone: string): Promise<Admin | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'phone_number = :phone',
        ExpressionAttributeValues: { ':phone': phone },
      }),
    );
    return (result.Items?.[0] as Admin) ?? null;
  }

  async findByUserName(userName: string): Promise<Admin | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'user_name = :userName',
        ExpressionAttributeValues: { ':userName': userName },
      }),
    );
    return (result.Items?.[0] as Admin) ?? null;
  }

  async findByStoreId(storeId: string): Promise<Admin | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'store_id = :storeId',
        ExpressionAttributeValues: { ':storeId': storeId },
      }),
    );
    return (result.Items?.[0] as Admin) ?? null;
  }

  async update(id: string, admin: Partial<Admin>): Promise<Admin> {
    const keys = Object.keys(admin);
    if (keys.length === 0) {
      return await this.findById(id);
    }

    const updateExpressions = keys.map((_key, i) => `#k${i} = :v${i}`).join(', ');
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    keys.forEach((key, i) => {
      expressionAttributeNames[`#k${i}`] = key;
      expressionAttributeValues[`:v${i}`] = (admin as any)[key];
    });

    await this.dynamoRepository.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.dynamoRepository.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }
}
