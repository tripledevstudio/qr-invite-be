import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ description: 'Name of the store', example: 'VinMart Landmark 81' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional({ description: 'Store address', example: '208 Nguyen Huu Canh, Binh Thanh, HCMC' })
  @IsString()
  @IsOptional()
  readonly address?: string;

  @ApiPropertyOptional({ description: 'Phone number of the store' })
  @IsString()
  @IsOptional()
  readonly phone_number?: string;

  @ApiPropertyOptional({ description: 'Contact email of the store' })
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional({ description: 'Default commission percentage', example: 10 })
  @IsNumber()
  @IsOptional()
  readonly default_commission?: number;

  @ApiPropertyOptional({ description: 'Extra bonus for orders above 500k' })
  @IsNumber()
  @IsOptional()
  readonly extra_bonus?: number;

  @ApiPropertyOptional({ description: 'Monthly revenue' })
  @IsNumber()
  @IsOptional()
  readonly monthly_revenue?: number;

}
