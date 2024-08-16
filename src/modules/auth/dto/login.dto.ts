import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Country code', example: '+91' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({
    description: 'User mobile number',
    example: '7285868035',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @ApiProperty({
    description: 'User PIN',
    example: '123456',
    type: String,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  pin: string;
}
