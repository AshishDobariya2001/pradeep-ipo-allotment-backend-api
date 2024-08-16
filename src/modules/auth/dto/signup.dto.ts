import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
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

  @ApiPropertyOptional({
    description: 'User name',
    example: 'John Doe',
    type: String,
  })
  name?: string;

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
