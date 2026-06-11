import { Injectable } from '@nestjs/common';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { USER_TABLE_NAME } from '../../../dynamo/constants';

@Injectable()
export class DynamoUserRepository implements UserRepository {
  private readonly tableName = USER_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async create(user: User): Promise<User> {
    const item = { ...user, id: user.id ?? randomUUID() };
    await this.dynamoRepository.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    return (result.Item as User) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
      }),
    );
    return (result.Items?.[0] as User) ?? null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'phone_number = :phone',
        ExpressionAttributeValues: { ':phone': phone },
      }),
    );
    return (result.Items?.[0] as User) ?? null;
  }

  // New method to find a user by their user_name
  async findByUserName(userName: string): Promise<User | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'user_name = :userName',
        ExpressionAttributeValues: { ':userName': userName },
      }),
    );
    return (result.Items?.[0] as User) ?? null;
  }

  async findByInviteCode(inviteCode: string): Promise<User | null> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression:
          'invite_code = :invite AND (attribute_not_exists(deleted_at) OR deleted_at = :null_val)',
        ExpressionAttributeValues: {
          ':invite': inviteCode,
          ':null_val': null,
        },
      }),
    );
    return (result.Items?.[0] as User) ?? null;
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const keys = Object.keys(user);
    if (keys.length === 0) {
      return await this.findById(id);
    }

    const updateExpressions = keys.map((_key, i) => `#k${i} = :v${i}`).join(', ');
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    keys.forEach((key, i) => {
      expressionAttributeNames[`#k${i}`] = key;
      expressionAttributeValues[`:v${i}`] = (user as any)[key];
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
