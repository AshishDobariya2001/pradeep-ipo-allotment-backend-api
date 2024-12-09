import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
  Matches,
  ArrayMinSize,
  IsArray,
} from 'class-validator';

export class CreateContactDto {
  // @ApiPropertyOptional({ description: 'Contact name', example: 'John Doe' })
  // @IsOptional()
  // @IsString()
  // name: string;

  @ApiProperty({ description: 'PAN card number', example: 'FOOPD3254P' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @Matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, {
    message: 'PanNumber is not valid',
  })
  panNumber: string;

  // @ApiPropertyOptional({
  //   description: 'Email address',
  //   example: 'john.doe@example.com',
  // })
  // @IsOptional()
  // @IsEmail()
  // email: string;

  // @ApiProperty({ description: 'Country code', example: '+91' })
  // @IsString()
  // @IsOptional()
  // countryCode: string;

  // @ApiProperty({
  //   description: 'User mobile number',
  //   example: '728586835',
  //   type: String,
  // })
  // @IsOptional()
  // @IsString()
  // @MinLength(10)
  // @MaxLength(10)
  // phoneNumber: string;
}

export class GetContactByPanNumbersDto {
  @ApiProperty({
    description: 'Array of PAN card numbers',
    example: ['FOOPD3254P', 'ABCDE1234Z'],
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one PAN number must be provided' })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @Transform(({ value }) => value.map((pan: string) => pan.toUpperCase()))
  @Matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, {
    each: true,
    message: 'Each PAN number must be valid',
  })
  panNumbers: string[];
}
