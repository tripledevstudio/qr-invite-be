import { Injectable } from '@nestjs/common';
import { StoreRepository } from '../../domain/repositories/store.repository';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { randomUUID } from 'crypto';
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { STORE_TABLE_NAME } from '../../../dynamo/constants';
import { CreateStoreDto } from '../../dto/create-store.dto';
import { UpdateStoreDto } from '../../dto/update-store.dto';
import { Store } from '../../domain/entities/store.entity';

@Injectable()
export class DynamoStoreRepository implements StoreRepository {
  private readonly tableName = STORE_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async create(dto: CreateStoreDto): Promise<Store> {
    const now = new Date().toISOString();
    const item: Store = {
      id: randomUUID(),
      ...dto,
      created_at: now,
      updated_at: now,
    };
    await this.dynamoRepository.send(
      new PutCommand({ TableName: this.tableName, Item: item }),
    );
    return item;
  }

  async findAll(): Promise<Store[]> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({ TableName: this.tableName }),
    );
    return (result.Items ?? []) as Store[];
  }

  async findOne(id: string): Promise<Store> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    const store = result.Item as Store | undefined;
    if (!store) {
      throw new Error(`Store with ID ${id} not found`);
    }
    return store;
  }

  async update(id: string, dto: UpdateStoreDto): Promise<Store> {
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

    // updated_at timestamp
    expressionAttributeNames[`#k${keys.length}`] = 'updated_at';
    expressionAttributeValues[`:v${keys.length}`] = new Date().toISOString();

    await this.dynamoRepository.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions}, #k${keys.length} = :v${keys.length}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.dynamoRepository.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id } }),
    );
    return { deleted: true };
  }
}