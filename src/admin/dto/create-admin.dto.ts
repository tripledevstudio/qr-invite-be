import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, IsArray } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  user_name: string;

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

  @ApiPropertyOptional({ type: [String], description: 'List of Store IDs this admin belongs to' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  store_ids?: string[];
}
