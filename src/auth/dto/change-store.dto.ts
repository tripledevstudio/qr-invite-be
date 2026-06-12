import { ApiPropertyOptional } from '@nestjs/swagger';

export class ChangeStoreDto {
  @ApiPropertyOptional()
  store_id!: string;
}
