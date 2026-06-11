import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Name of the service', example: 'Premium Cleaning' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'Detailed description of the service' })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({ description: 'Primary image URL' })
  @IsString()
  @IsOptional()
  readonly image?: string;

  @ApiPropertyOptional({ description: 'Additional image URLs', type: [String] })
  @IsArray()
  @IsOptional()
  readonly images?: string[];

  @ApiPropertyOptional({ description: 'Points value (cost) of the service', example: 100 })
  @IsNumber()
  @IsOptional()
  readonly points_value?: number;

  @ApiPropertyOptional({ description: 'Monetary price of the service', example: 49.99 })
  @IsNumber()
  @IsOptional()
  readonly monetary_value?: number;

  @ApiPropertyOptional({ description: 'Available quantity', example: 10 })
  @IsNumber()
  @IsOptional()
  readonly quantity?: number;
}
