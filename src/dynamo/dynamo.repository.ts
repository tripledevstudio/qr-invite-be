import { Injectable } from '@nestjs/common';
import { DynamoDBService } from './dynamo.service';

/**
 * Simple wrapper to centralize DynamoDB DocumentClient `send` calls.
 * This reduces repetition and makes future enhancements (e.g., logging,
 * retries, metrics) easier to implement in one place.
 */
@Injectable()
export class DynamoRepository {
  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async send(command: any): Promise<any> {
    return this.dynamoDBService.getDocClient().send(command);
  }
}