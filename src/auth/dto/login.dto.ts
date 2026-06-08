import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  password: string;
}
