import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateStoreDto {
  @ApiPropertyOptional({ description: 'Name of the store', example: 'VinMart Central Park' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'Store address', example: '720A Dien Bien Phu, Binh Thanh, HCMC' })
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

  @ApiPropertyOptional({ description: 'List of collaborator (user) IDs participating in the store', type: [String] })
  @IsArray()
  @IsOptional()
  readonly collaborator_ids?: string[];
}
