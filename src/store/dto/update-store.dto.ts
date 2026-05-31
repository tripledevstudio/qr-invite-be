import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateStoreDto {
  @ApiPropertyOptional({ description: 'Name of the store', example: 'VinMart Central Park' })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({ description: 'Store address', example: '720A Dien Bien Phu, Binh Thanh, HCMC' })
  @IsString()
  @IsOptional()
  readonly address?: string;
}