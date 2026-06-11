import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ListStoreUsersDto {
  @ApiPropertyOptional({ description: 'Current page number', default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  page_size?: number = 10;

  @ApiPropertyOptional({ description: 'Sort field (e.g. created_at, name)', default: 'created_at' })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({
    description: 'Sort order (asc, desc)',
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ description: 'Start date for filtering (ISO format)' })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional({ description: 'End date for filtering (ISO format)' })
  @IsOptional()
  @IsString()
  end_date?: string;

  @ApiPropertyOptional({ description: 'Search query for user name' })
  @IsOptional()
  @IsString()
  search?: string;
}
