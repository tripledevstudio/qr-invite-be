import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  user_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
