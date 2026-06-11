import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for pagination parameters.
 * - `page`: starts from 1.
 * - `page_size`: number of items per page.
 */
export class PaginationDto {
  @ApiProperty({
    description: 'Current page number (starts at 1)',
    example: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly page_size: number = 10;
}
