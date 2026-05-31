import { Injectable } from '@nestjs/common';
import { CheckInRepository } from '../../domain/repositories/check-in.repository';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { randomUUID } from 'crypto';
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { CHECK_IN_TABLE_NAME } from '../../../dynamo/constants';
import { CheckInDto } from '../../dto/check-in.dto';
import { CheckInFilterDto } from '../../dto/check-in-filter.dto';
import { CheckIn } from '../../domain/entities/check-in.entity';

@Injectable()
export class DynamoCheckInRepository implements CheckInRepository {
  private readonly tableName = CHECK_IN_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async checkIn(dto: CheckInDto): Promise<CheckIn> {
    const item: CheckIn = {
      id: randomUUID(),
      user_id: dto.user_id,
      store_id: dto.store_id,
      timestamp: new Date().toISOString(),
    };
    await this.dynamoRepository.send(
      new PutCommand({ TableName: this.tableName, Item: item }),
    );
    return item;
  }

  async findOne(id: string): Promise<CheckIn | undefined> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    return result.Item as CheckIn;
  }

  async getLogs(filter: CheckInFilterDto): Promise<CheckIn[]> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({ TableName: this.tableName }),
    );
    const records = (result.Items ?? []) as CheckIn[];

    const { user_id, store_id, from, to } = filter;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    return records.filter(rec => {
      if (user_id && rec.user_id !== user_id) return false;
      if (store_id && rec.store_id !== store_id) return false;
      const recDate = new Date(rec.timestamp);
      if (fromDate && recDate < fromDate) return false;
      if (toDate && recDate > toDate) return false;
      return true;
    });
  }

  async update(id: string, dto: Partial<CheckInDto>): Promise<CheckIn | undefined> {
    const keys = Object.keys(dto);
    if (keys.length === 0) {
      return this.findOne(id);
    }

    const updateExpressions = keys
      .map((key, i) => `#k${i} = :v${i}`)
      .join(', ');
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      expressionAttributeNames[`#k${i}`] = key;
      expressionAttributeValues[`:v${i}`] = (dto as any)[key];
    }

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

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    await this.dynamoRepository.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id } }),
    );
    return { deleted: true };
  }
}