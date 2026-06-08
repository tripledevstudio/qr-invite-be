import { Injectable } from '@nestjs/common';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { StoreUser } from '../../domain/entities/store-user.entity';
import { StoreUserRepository } from '../../domain/repositories/store-user.repository';
import {
    PutCommand,
    QueryCommand,
    DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { STORE_USER_TABLE_NAME } from '../../../dynamo/constants';
import { randomUUID } from 'crypto';

@Injectable()
export class DynamoStoreUserRepository implements StoreUserRepository {
    private readonly tableName = STORE_USER_TABLE_NAME;

    constructor(private readonly dynamoRepository: DynamoRepository) { }

    async create(storeUser: StoreUser): Promise<StoreUser> {
        const item = {
            ...storeUser,
            // Ensure primary keys are set; fallback to random UUIDs if missing (unlikely)
            store_id: storeUser.store_id,
            user_id: storeUser.user_id,
        };
        await this.dynamoRepository.send(
            new PutCommand({ TableName: this.tableName, Item: item })
        );
        return item;
    }

    async findByStoreId(storeId: string): Promise<StoreUser[]> {
        const result = await this.dynamoRepository.send(
            new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: 'store_id = :sid',
                ExpressionAttributeValues: { ':sid': storeId },
            })
        );
        return (result.Items ?? []) as StoreUser[];
    }

    async delete(storeId: string, userId: string): Promise<void> {
        await this.dynamoRepository.send(
            new DeleteCommand({
                TableName: this.tableName,
                Key: { store_id: storeId, user_id: userId },
            })
        );
    }
}