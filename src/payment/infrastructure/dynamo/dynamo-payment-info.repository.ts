import { Injectable } from '@nestjs/common';
import { DynamoRepository } from '../../../dynamo/dynamo.repository';
import { PaymentInfo } from '../../domain/entities/payment-info.entity';
import { PaymentInfoRepository } from '../../domain/repositories/payment-info.repository';
import { GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { PAYMENT_INFO_TABLE_NAME } from '../../../dynamo/constants';

@Injectable()
export class DynamoPaymentInfoRepository implements PaymentInfoRepository {
  private readonly tableName = PAYMENT_INFO_TABLE_NAME;

  constructor(private readonly dynamoRepository: DynamoRepository) {}

  async getByUserId(userId: string): Promise<PaymentInfo | null> {
    const result = await this.dynamoRepository.send(
      new GetCommand({ TableName: this.tableName, Key: { id: userId } }),
    );
    return (result.Item as PaymentInfo) ?? null;
  }

  async update(userId: string, data: Partial<PaymentInfo>): Promise<PaymentInfo> {
    const keys = Object.keys(data).filter((key) => data[key as keyof PaymentInfo] !== undefined);

    const updateExpressionsList: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    keys.forEach((key, i) => {
      expressionAttributeNames[`#k${i}`] = key;
      expressionAttributeValues[`:v${i}`] = (data as any)[key];
      updateExpressionsList.push(`#k${i} = :v${i}`);
    });

    const now = new Date().toISOString();

    // updated_at
    expressionAttributeNames[`#k_updated`] = 'updated_at';
    expressionAttributeValues[`:v_updated`] = now;
    updateExpressionsList.push(`#k_updated = :v_updated`);

    // created_at
    expressionAttributeNames[`#k_created`] = 'created_at';
    expressionAttributeValues[`:v_created`] = now;
    updateExpressionsList.push(`#k_created = if_not_exists(#k_created, :v_created)`);

    await this.dynamoRepository.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id: userId },
        UpdateExpression: `SET ${updateExpressionsList.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    );

    return await this.getByUserId(userId);
  }

  async delete(userId: string): Promise<void> {
    await this.dynamoRepository.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id: userId } }),
    );
  }
}
