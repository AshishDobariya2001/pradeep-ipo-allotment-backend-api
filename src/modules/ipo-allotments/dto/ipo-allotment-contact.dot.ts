import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

export class IpoAllotmentContactDto {
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // companyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @Matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)
  panNumber: string;
}
