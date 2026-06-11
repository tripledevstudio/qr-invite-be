import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ProcessCheckInDto {
  @ApiProperty({ description: 'The invite code of the COLLABORATOR being scanned' })
  @IsString()
  @IsNotEmpty()
  readonly invite_code!: string;

  @ApiProperty({ description: 'The total value of the order' })
  @IsNumber()
  @Min(0)
  readonly order_amount!: number;
}
