import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO used when a user checks into a store.
 */
export class CheckInDto {
  @ApiProperty({ name: 'user_id', description: 'Identifier of the user performing the check‑in' })
  @IsString()
  @IsNotEmpty()
  readonly user_id!: string;

  @ApiProperty({
    name: 'store_id',
    description: 'Identifier of the store where the user checks in',
  })
  @IsString()
  @IsNotEmpty()
  readonly store_id!: string;
}
