import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiPropertyOptional()
  ref_code?: string;

  @ApiPropertyOptional()
  invite_code?: string;

  @ApiPropertyOptional()
  rank?: string;

  @ApiPropertyOptional()
  role?: string;
}
