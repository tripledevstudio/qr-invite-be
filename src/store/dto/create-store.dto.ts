import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: 'Name of the store', example: 'VinMart Landmark 81' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Store address', example: '208 Nguyen Huu Canh, Binh Thanh, HCMC', required: false })
  @IsString()
  @IsOptional()
  readonly address?: string;
}