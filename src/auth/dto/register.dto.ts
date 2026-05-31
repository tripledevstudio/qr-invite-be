import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  ref_code?: string;

  @ApiPropertyOptional()
  invite_code?: string;

  @ApiPropertyOptional()
  rank?: string;

  @ApiPropertyOptional()
  role?: string;
}
