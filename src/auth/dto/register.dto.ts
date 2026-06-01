import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRank, UserRole } from '../../user/domain/entities/user.entity';

export class RegisterDto {
  @ApiProperty()
  name: string;

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
}
