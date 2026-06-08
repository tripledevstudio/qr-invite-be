import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoginAdminDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  user_name?: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}