import { ApiPropertyOptional } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone_number?: string;
}