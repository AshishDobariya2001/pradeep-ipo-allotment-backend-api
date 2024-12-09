import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Country code', example: '+91' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({
    description: 'User mobile number',
    example: '728586835',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @ApiProperty({ description: 'OTP', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  tempOtp: string;

  @ApiProperty({
    description: 'Device information',
    type: 'object',
    example: { deviceId: '123', deviceType: 'mobile' },
  })
  @ApiPropertyOptional()
  @IsOptional()
  device: object;
}
