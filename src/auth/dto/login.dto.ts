import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional()
  phone_number?: string;

  @ApiPropertyOptional()
  user_name?: string;

  @ApiProperty()
  password!: string;
}
