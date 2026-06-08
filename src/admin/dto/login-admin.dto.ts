import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;
}