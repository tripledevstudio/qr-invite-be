import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Admin {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  user_name: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ description: 'List of Store IDs this admin belongs to' })
  store_ids?: string[];
  @ApiPropertyOptional({ description: 'The currently active Store ID for this admin' })
  current_store_id?: string;
}
