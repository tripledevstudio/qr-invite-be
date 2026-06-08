import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsArray } from 'class-validator';
import { UserRank, UserRole } from '../../user/domain/entities/user.entity';

export class RegisterDto {
  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  user_name?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone_number?: string;

  @ApiProperty()
  password: string;

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

  @ApiPropertyOptional({ description: 'List of store IDs this user is registering for', type: [String] })
  @IsOptional()
  @IsArray()
  store_ids?: string[];
}
