import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiProperty()
  password: string;
}
