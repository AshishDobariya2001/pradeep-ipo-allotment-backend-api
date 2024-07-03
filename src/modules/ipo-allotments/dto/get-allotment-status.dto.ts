import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

export class GetIpoAllotmentStatusDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalCompanyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  //   @Transform(({ value }) => Number(value))
  id?: string;
}
