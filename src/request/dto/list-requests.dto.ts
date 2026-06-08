import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsIn } from 'class-validator';
import { RequestType, RequestStatus } from '../domain/entities/request.entity';

export class ListRequestsDto {
  @ApiPropertyOptional({ enum: RequestType, description: 'Filter by request type' })
  @IsOptional()
  @IsEnum(RequestType)
  readonly type?: RequestType;

  @ApiPropertyOptional({ enum: RequestStatus, description: 'Filter by request status' })
  @IsOptional()
  @IsEnum(RequestStatus)
  readonly status?: RequestStatus;

  @ApiPropertyOptional({ description: 'Field to sort by (e.g. createdAt)' })
  @IsOptional()
  @IsString()
  readonly sort_by?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  readonly sort_order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Filter by store ID' })
  @IsOptional()
  @IsString()
  readonly store_id?: string;
}
