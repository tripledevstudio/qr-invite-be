import { Injectable } from '@nestjs/common';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { Request, RequestStatus } from '../../domain/entities/request.entity';
import { RequestRepository } from '../../domain/repositories/request.repository';
import { PutCommand, GetCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { REQUEST_TABLE_NAME } from '../../../dynamo/constants';

@Injectable()
export class DynamoRequestRepository implements RequestRepository {
  private readonly tableName = REQUEST_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async create(request: Request): Promise<Request> {
    const item = { ...request, id: request.id ?? randomUUID(), status: RequestStatus.PENDING };
    await this.dynamoRepository.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findById(id: string): Promise<Request | null> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id } })
    );
    return (result.Item as Request) ?? null;
  }

  async update(id: string, updates: Partial<Request>): Promise<Request | null> {
    const keys = Object.keys(updates);
    if (keys.length === 0) {
      return this.findById(id);
    }

    const updateExpressions = keys.map((_key, i) => `#k${i} = :v${i}`).join(', ');
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    keys.forEach((key, i) => {
      expressionAttributeNames[`#k${i}`] = key;
      expressionAttributeValues[`:v${i}`] = (updates as any)[key];
    });

    await this.dynamoRepository.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return this.findById(id);
  }

  async findByUserId(userId: string): Promise<Request[]> {
    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'user_id = :user_id',
        ExpressionAttributeValues: { ':user_id': userId },
      })
    );
    return (result.Items as Request[]) ?? [];
  }

  async findAll(filters?: {
    type?: string;
    status?: string;
    store_id?: string;
    sort_by?: string;
    sort_order?: 'ASC' | 'DESC';
  }): Promise<Request[]> {
    const filterExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (filters?.status) {
      filterExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = filters.status;
    }

    if (filters?.type) {
      filterExpressions.push('#type = :type');
      expressionAttributeNames['#type'] = 'type';
      expressionAttributeValues[':type'] = filters.type;
    }

    if (filters?.store_id) {
      filterExpressions.push('#store_id = :store_id');
      expressionAttributeNames['#store_id'] = 'store_id';
      expressionAttributeValues[':store_id'] = filters.store_id;
    }

    const filterExpression =
      filterExpressions.length > 0 ? filterExpressions.join(' AND ') : undefined;

    const result = await this.dynamoRepository.send(
      new ScanCommand({
        TableName: this.tableName,
        ...(filterExpression && { FilterExpression: filterExpression }),
        ...(Object.keys(expressionAttributeNames).length > 0 && {
          ExpressionAttributeNames: expressionAttributeNames
        }),
        ...(Object.keys(expressionAttributeValues).length > 0 && {
          ExpressionAttributeValues: expressionAttributeValues
        }),
      })
    );

    const items = (result.Items as Request[]) ?? [];

    // Sorting in memory
    const sortBy = filters?.sort_by || 'created_at';
    const sortOrder = filters?.sort_order || 'DESC';

    items.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (valA instanceof Date) {
        valA = valA.getTime();
      } else if ((sortBy === 'created_at' || sortBy === 'updated_at') && typeof valA === 'string') {
        valA = new Date(valA).getTime();
      }

      if (valB instanceof Date) {
        valB = valB.getTime();
      } else if ((sortBy === 'created_at' || sortBy === 'updated_at') && typeof valB === 'string') {
        valB = new Date(valB).getTime();
      }

      if (valA < valB) {
        return sortOrder === 'ASC' ? -1 : 1;
      }
      if (valA > valB) {
        return sortOrder === 'ASC' ? 1 : -1;
      }
      return 0;
    });

    return items;
  }
}
