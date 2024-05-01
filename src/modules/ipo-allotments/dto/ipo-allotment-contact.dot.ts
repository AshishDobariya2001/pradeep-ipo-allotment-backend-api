import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class IpoAllotmentContactDto {
  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // companyName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  panNumber: string;
}
