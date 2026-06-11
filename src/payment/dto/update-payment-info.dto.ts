import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentInfoDto {
  @ApiPropertyOptional()
  bank_code?: string;

  @ApiPropertyOptional()
  account_number?: string;

  @ApiPropertyOptional()
  account_holder_name?: string;

  @ApiPropertyOptional()
  qr_image_url?: string;
}
