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

  @ApiProperty({ description: 'Store ID this admin belongs to' })
  store_id: string;
}