import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsArray } from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  user_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ type: [String], description: 'List of Store IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  store_ids?: string[];

  @ApiPropertyOptional({ description: 'Current active Store ID' })
  @IsOptional()
  @IsString()
  current_store_id?: string;
}
