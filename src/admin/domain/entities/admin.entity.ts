import { ApiProperty } from '@nestjs/swagger';

export class Admin {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  phone_number?: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ description: 'Store ID this admin belongs to' })
  store_id: string;
}