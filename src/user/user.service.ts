import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../dynamo/dynamo.service';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { USER_TABLE_NAME } from '../dynamo/constants';

@Injectable()
export class UserService {
  private readonly tableName = USER_TABLE_NAME;

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async create(dto: any) {
    const item = { id: randomUUID(), ...dto };
    await this.dynamoDBService
      .getDocClient()
      .send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findOne(id: string) {
    const result = await this.dynamoDBService
      .getDocClient()
      .send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return result.Item;
  }

  async update(id: string, dto: any) {
    const keys = Object.keys(dto);
    if (keys.length === 0) {
      return this.findOne(id);
    }

    const updateExpressions = keys.map((_key, i) => `#k${i} = :v${i}`).join(', ');
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      expressionAttributeNames[`#k${i}`] = key;
      expressionAttributeValues[`:v${i}`] = dto[key];
    }

    await this.dynamoDBService.getDocClient().send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      }),
    );
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.dynamoDBService
      .getDocClient()
      .send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
    return { deleted: true };
  }
}
