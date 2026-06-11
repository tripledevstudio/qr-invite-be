import { Injectable } from '@nestjs/common';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { PointHistory } from '../../domain/entities/point-history.entity';
import { PointHistoryRepository } from '../../domain/repositories/point-history.repository';
import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { POINT_HISTORY_TABLE_NAME } from '../../../dynamo/constants';

@Injectable()
export class DynamoPointHistoryRepository implements PointHistoryRepository {
  private readonly tableName = POINT_HISTORY_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async create(history: PointHistory): Promise<PointHistory> {
    const item = {
      ...history,
      id: history.id ?? randomUUID(),
      created_at: new Date().toISOString(),
    };
    await this.dynamoRepository.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findById(id: string): Promise<PointHistory | null> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } })
    );
    return (result.Item as PointHistory) ?? null;
  }

  async findByUserId(userId: string): Promise<PointHistory[]> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'user_id = :user_id',
        ExpressionAttributeValues: { ':user_id': userId },
      })
    );
    return (result.Items as PointHistory[]) ?? [];
  }
}
