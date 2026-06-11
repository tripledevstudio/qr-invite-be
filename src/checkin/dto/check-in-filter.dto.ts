import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsISO8601 } from 'class-validator';

/**
 * DTO for filtering check‑in logs.
 * All fields are optional; when omitted they are not applied as filters.
 */
export class CheckInFilterDto {
  @ApiPropertyOptional({ description: 'ISO date string for start of time range' })
  @IsOptional()
  @IsISO8601()
  readonly from?: string;

  @ApiPropertyOptional({ description: 'ISO date string for end of time range' })
  @IsOptional()
  @IsISO8601()
  readonly to?: string;
}
