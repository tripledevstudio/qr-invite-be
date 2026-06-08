import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsArray } from 'class-validator';
import { UserRank, UserRole } from '../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  user_name?: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiPropertyOptional()
  ref_code?: string;

  @ApiPropertyOptional()
  invite_code?: string;

  @ApiPropertyOptional({ enum: UserRank })
  @IsOptional()
  @IsEnum(UserRank)
  rank?: UserRank;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: 'List of store IDs this user belongs to', type: [String] })
  @IsOptional()
  @IsArray()
  store_ids?: string[];
}
