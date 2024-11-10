import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateContactDto {
  @ApiPropertyOptional({ description: 'Contact name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'PAN card number', example: 'A123456789' })
  @IsString()
  @IsNotEmpty()
  panNumber: string;

  @ApiPropertyOptional({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Country code', example: '+91' })
  @IsString()
  @IsOptional()
  countryCode: string;

  @ApiProperty({
    description: 'User mobile number',
    example: '728586835',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;
}
