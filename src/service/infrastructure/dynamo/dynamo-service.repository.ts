import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../../domain/repositories/service.repository';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { randomUUID } from 'crypto';
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { SERVICE_TABLE_NAME } from '../../../dynamo/constants';
import { CreateServiceDto } from '../../dto/create-service.dto';
import { UpdateServiceDto } from '../../dto/update-service.dto';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class DynamoServiceRepository implements ServiceRepository {
  private readonly tableName = SERVICE_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const now = new Date().toISOString();
    const item: Service = {
      id: randomUUID(),
      ...dto,
      created_at: now,
      updated_at: now,
    };
    await this.dynamoRepository.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findAll(): Promise<Service[]> {
    const result = await this.dynamoRepository.send(new ScanCommand({ TableName: this.tableName }));
    return (result.Items ?? []) as Service[];
  }

  async findOne(id: string): Promise<Service> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    const service = result.Item as Service | undefined;
    if (!service) {
      throw new Error(`Service with ID ${id} not found`);
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
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
      })
    );

    return this.findOne(id);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.dynamoRepository.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
    return { deleted: true };
  }
}
