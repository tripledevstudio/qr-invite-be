import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAdminDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  store_id: string;
}