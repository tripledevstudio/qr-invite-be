import { ApiProperty } from '@nestjs/swagger';

export class SwitchStoreDto {
  @ApiProperty({ description: 'Store ID to switch to' })
  store_id: string;
}
